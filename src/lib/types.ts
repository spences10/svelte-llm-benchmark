// src/lib/types.ts

// Define the interface for a benchmark run fetched from the database
export interface BenchmarkRun {
	run_id: number;
	llm_model: string;
	timestamp: string;
	total_duration_ms: number;
	total_tasks: number;
	passed_tasks: number;
	failed_tasks: number;
	error_tasks: number;
	overall_status: string; // Added overall status field
}

// Define the interface for a single task result fetched from the database
export interface TaskResult {
	task_result_id?: number; // Make optional
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
