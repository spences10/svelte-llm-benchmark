// src/routes/results/[run_id]/+page.server.ts
import type { PageServerLoad } from './$types';

// Define the interface for a single task result fetched from the database
export interface TaskResult {
	// Exported interface
	task_result_id: number;
	run_id: number;
	benchmark_name: string;
	status: 'pass' | 'fail' | 'error';
	duration_ms: number;
	generated_code: string;
	test_output: string;
	error_message?: string;
}

// Define the interface for detailed benchmark run data, including task results
export interface RunDetailsWithTasks {
	// Exported interface
	run_id: number;
	llm_model: string;
	timestamp: string;
	total_duration_ms: number;
	total_tasks: number;
	passed_tasks: number;
	failed_tasks: number;
	error_tasks: number;
	overall_status: string;
	model_name?: string; // Include model_name from the request body/storage
	task_results: TaskResult[]; // Array of associated task results
}

import { get_benchmark_run_details } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const run_id = Number(params.run_id);

	// Fetch detailed benchmark run data and task results from Turso database based on run_id
	const benchmark_run_details: RunDetailsWithTasks | null =
		await get_benchmark_run_details(run_id);

	return {
		run: benchmark_run_details,
	};
};
