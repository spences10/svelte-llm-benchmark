import { run_benchmark_task } from '$lib/benchmark_runner';
import { openrouter_client } from '$lib/llm_clients/openrouter';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Define the structure for the results JSON
interface BenchmarkResult {
	benchmark_name: string; // Renamed from 'benchmark'
	status: 'pass' | 'fail' | 'error'; // Status values changed
	duration_ms: number; // Added
	generated_code: string; // Added
	test_output: string; // Added
	error_message?: string; // Kept
	model_id: string; // Kept
	model_name?: string; // Kept
	timestamp: string; // Kept
	// Removed: details, stdout, stderr, pass_rate_k1, pass_rate_k5
}

// The results file is now a flat array of BenchmarkResult objects
type BenchmarkResultsFile = BenchmarkResult[];

export const POST: RequestHandler = async ({ params, request }) => {
	const benchmark_name = params.benchmark_name;
	let request_body;
	try {
		request_body = await request.json();
	} catch (e) {
		throw error(400, 'Invalid JSON request body');
	}

	const model_id = request_body.model_id;
	const model_name = request_body.model_name || model_id; // Use ID if name not provided

	if (!model_id) {
		throw error(400, 'Missing "model_id" in request body');
	}

	let run_result: BenchmarkResult;

	try {
		console.log(
			`Running benchmark '${benchmark_name}' for model '${model_id}'...`,
		);
		// Call the refactored benchmark runner function
		const result_from_runner = await run_benchmark_task(
			benchmark_name,
			openrouter_client, // Use the imported client instance
			model_id, // Pass the model ID
		);
		console.log(
			`Benchmark run completed for '${benchmark_name}' with model '${model_id}'. Status: ${result_from_runner.status}.`,
		);

		// Map the result from the runner to the BenchmarkResult interface for storage
		run_result = {
			benchmark_name: result_from_runner.benchmark_name,
			status: result_from_runner.status,
			duration_ms: result_from_runner.duration_ms,
			generated_code: result_from_runner.generated_code,
			test_output: result_from_runner.test_output,
			error_message: result_from_runner.error_message,
			model_id: model_id, // Keep original model_id from request
			model_name: model_name, // Keep original model_name from request
			timestamp: new Date().toISOString(), // Generate timestamp here
		};
	} catch (e: any) {
		console.error(
			`Error running benchmark '${benchmark_name}' with model '${model_id}':`,
			e,
		);
		// Create an error result if the runner throws an exception
		run_result = {
			benchmark_name: benchmark_name,
			status: 'error',
			duration_ms: 0, // Duration unknown if error before start
			generated_code: '',
			test_output: '',
			error_message:
				e.message ||
				'An unknown error occurred during benchmark execution.',
			model_id: model_id,
			model_name: model_name,
			timestamp: new Date().toISOString(),
		};
	}

	// --- Return Response ---
	return json({
		message: `Benchmark '${benchmark_name}' run completed for model '${model_id}'. Status: ${run_result.status}.`,
		result: run_result,
	});
};
