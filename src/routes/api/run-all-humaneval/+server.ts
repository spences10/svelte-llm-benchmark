// src/routes/api/run-all-humaneval/+server.ts
import { json } from '@sveltejs/kit';
import { run_benchmark_task } from '$lib/benchmark_runner';
import {
	insert_benchmark_run,
	insert_task_result,
} from '$lib/server/db';
import type { TaskResult } from '$lib/types'; // Import TaskResult type
import { openrouter_client } from '$lib/llm_clients/openrouter'; // Import OpenRouter client instance
import { readdir } from 'fs/promises';
import { join } from 'path';

// List of all HumanEval benchmark task names (based on directories in src/humaneval/)
// Dynamically read directories instead of hardcoding
async function get_benchmark_tasks(): Promise<string[]> {
	const humaneval_dir = join(process.cwd(), 'src', 'humaneval');
	const entries = await readdir(humaneval_dir, {
		withFileTypes: true,
	});
	// Filter for directories and exclude 'context' which seems to be documentation
	const task_names = entries
		.filter(
			(entry) => entry.isDirectory() && entry.name !== 'context',
		)
		.map((entry) => entry.name);
	return task_names;
}

/**
 * Handles POST requests to run all HumanEval benchmarks with a specified model.
 */
export async function POST({ request }) {
	try {
		const { model_id } = await request.json();

		if (!model_id) {
			return json(
				{ error: 'model_id is required in the request body.' },
				{ status: 400 },
			);
		}

		console.log(`Starting full benchmark run for model: ${model_id}`);
		const start_time = Date.now();

		const benchmark_tasks = await get_benchmark_tasks(); // Get tasks dynamically

		const task_results: TaskResult[] = [];
		let passed_tasks = 0;
		let failed_tasks = 0;
		let error_tasks = 0;

		// Iterate through each benchmark task and run it
		for (const task_name of benchmark_tasks) {
			console.log(`Running benchmark task: ${task_name}`);
			try {
				const benchmark_result = await run_benchmark_task(
					task_name,
					openrouter_client, // Pass the OpenRouter client instance
					model_id, // Pass the model ID
				);
				// Map BenchmarkResult to TaskResult before pushing
				const task_result: TaskResult = {
					// task_result_id will be assigned by the database
					run_id: 0, // Placeholder, will be updated before insertion
					benchmark_name: benchmark_result.benchmark_name,
					status: benchmark_result.status,
					duration_ms: benchmark_result.duration_ms,
					generated_code: benchmark_result.generated_code,
					test_output: benchmark_result.test_output,
					error_message: benchmark_result.error_message,
				};
				task_results.push(task_result);

				if (task_result.status === 'pass') {
					passed_tasks++;
				} else if (task_result.status === 'fail') {
					failed_tasks++;
				} else {
					error_tasks++;
				}
			} catch (error: any) {
				console.error(
					`Error running benchmark task ${task_name}:`,
					error,
				);
				// If a task runner itself throws an unhandled error, record it
				task_results.push({
					benchmark_name: task_name,
					status: 'error',
					duration_ms: 0, // Or some indicator of failure before timing
					generated_code: '',
					test_output: '',
					error_message:
						error.message || 'Unknown error during task execution',
					// Need to satisfy TaskResult interface, add dummy values
					task_result_id: 0, // Dummy ID, will be assigned by DB
					run_id: 0, // Dummy ID, will be assigned after inserting overall run
				});
				error_tasks++;
			}
		}

		const end_time = Date.now();
		const total_duration_ms = end_time - start_time;
		const total_tasks = benchmark_tasks.length;

		// Determine overall status
		let overall_status = 'passed';
		if (failed_tasks > 0) {
			overall_status = 'failed';
		} else if (error_tasks > 0) {
			overall_status = 'error';
		}

		// Save the overall benchmark run details
		const run_id = await insert_benchmark_run({
			llm_model: model_id, // Using model_id as llm_model name for now
			timestamp: new Date().toISOString(),
			total_duration_ms,
			total_tasks,
			passed_tasks,
			failed_tasks,
			error_tasks,
			overall_status,
		});

		// Save individual task results, linking them to the new run_id
		for (const task_result of task_results) {
			// Update the run_id for each task result before inserting
			task_result.run_id = run_id;
			await insert_task_result(task_result);
		}

		console.log(
			`Full benchmark run completed for model: ${model_id}, Run ID: ${run_id}`,
		);

		return json({
			message: 'Benchmark run completed successfully.',
			run_id: run_id,
			overall_status: overall_status,
		});
	} catch (error) {
		console.error('Error during full benchmark run:', error);
		return json(
			{ error: 'An error occurred during the benchmark run.' },
			{ status: 500 },
		);
	}
}
