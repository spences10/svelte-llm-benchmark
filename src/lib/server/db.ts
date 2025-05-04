// src/lib/server/db.ts
import {
	TURSO_AUTH_TOKEN,
	TURSO_DATABASE_URL,
} from '$env/static/private';
import type {
	BenchmarkRun,
	RunDetailsWithTasks,
	TaskResult,
} from '$lib/types'; // Import interfaces from shared types
import { createClient, type ResultSet } from '@libsql/client'; // Import types

// Initialize the Turso client
const turso_client = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN,
});

/**
 * Inserts a new benchmark run record into the database.
 * @param run_data - The data for the benchmark run.
 * @returns A promise resolving to the ID of the newly inserted run.
 */
export async function insert_benchmark_run(run_data: {
	llm_model: string;
	timestamp: string;
	total_duration_ms: number;
	total_tasks: number;
	passed_tasks: number;
	failed_tasks: number;
	error_tasks: number;
	overall_status: string; // Added overall_status based on table schema update
}): Promise<number> {
	console.log('Inserting benchmark run into Turso:', run_data);

	const result = await turso_client.execute({
		sql: 'INSERT INTO benchmark_runs (llm_model, timestamp, total_duration_ms, total_tasks, passed_tasks, failed_tasks, error_tasks, overall_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
		args: [
			run_data.llm_model,
			run_data.timestamp,
			run_data.total_duration_ms,
			run_data.total_tasks,
			run_data.passed_tasks,
			run_data.failed_tasks,
			run_data.error_tasks,
			run_data.overall_status,
		],
	});

	// Assuming the execute result contains the last inserted row ID
	// If not, a separate SELECT last_insert_rowid() query might be needed
	if (result.lastInsertRowid === undefined) {
		// Fallback or error handling if lastInsertRowid is not available
		console.warn(
			'lastInsertRowid not available directly from insert result, attempting SELECT last_insert_rowid()',
		);
		const select_id_result = await turso_client.execute(
			'SELECT last_insert_rowid();',
		);
		if (select_id_result.rows && select_id_result.rows[0]) {
			return Number(select_id_result.rows[0]['last_insert_rowid()']);
		} else {
			throw new Error(
				'Could not retrieve last insert row ID after inserting benchmark run.',
			);
		}
	}

	return Number(result.lastInsertRowid);
}

/**
 * Inserts a new task result record into the database.
 * @param task_data - The data for the task result, including the run_id.
 * @returns A promise that resolves when the insertion is complete.
 */
export async function insert_task_result(task_data: {
	run_id: number;
	benchmark_name: string;
	status: 'pass' | 'fail' | 'error';
	duration_ms: number;
	generated_code: string;
	test_output: string;
	error_message?: string;
}): Promise<void> {
	console.log('Inserting task result into Turso:', task_data);

	await turso_client.execute({
		sql: 'INSERT INTO task_results (run_id, benchmark_name, status, duration_ms, generated_code, test_output, error_message) VALUES (?, ?, ?, ?, ?, ?, ?);',
		args: [
			task_data.run_id,
			task_data.benchmark_name,
			task_data.status,
			task_data.duration_ms,
			task_data.generated_code,
			task_data.test_output,
			task_data.error_message ?? null, // Use null for undefined error_message
		],
	});
}

// TODO: Add functions to retrieve results for visualization later

/**
 * Retrieves all benchmark run records from the database.
 * @returns A promise resolving to an array of benchmark run objects.
 */
export async function get_benchmark_runs(): Promise<BenchmarkRun[]> {
	// Updated return type
	console.log('Retrieving benchmark runs from database.');

	const result: ResultSet = await turso_client.execute(
		'SELECT * FROM benchmark_runs;',
	);

	// Map Row objects to BenchmarkRun interface
	const benchmark_runs: BenchmarkRun[] = result.rows.map((row) => ({
		run_id: Number(row.run_id),
		llm_model: String(row.llm_model),
		timestamp: String(row.timestamp),
		total_duration_ms: Number(row.total_duration_ms),
		total_tasks: Number(row.total_tasks),
		passed_tasks: Number(row.passed_tasks),
		failed_tasks: Number(row.failed_tasks),
		error_tasks: Number(row.error_tasks),
		overall_status: String(row.overall_status),
	}));

	return benchmark_runs;
}

/**
 * Retrieves detailed data for a single benchmark run, including associated task results.
 * @param run_id - The ID of the benchmark run to retrieve.
 * @returns A promise resolving to the benchmark run details object, or null if not found.
 */
export async function get_benchmark_run_details(
	run_id: number,
): Promise<RunDetailsWithTasks | null> {
	// Updated return type
	console.log(
		`Retrieving benchmark run details for run_id: ${run_id}`,
	);

	// Select the main benchmark run record
	const run_result: ResultSet = await turso_client.execute({
		sql: 'SELECT * FROM benchmark_runs WHERE run_id = ?;',
		args: [run_id],
	});

	// If no run found with this ID, return null
	if (run_result.rows.length === 0) {
		return null;
	}

	const run_data = run_result.rows[0];

	// Select all task results for this run ID
	const task_results_result: ResultSet = await turso_client.execute({
		sql: 'SELECT * FROM task_results WHERE run_id = ?;',
		args: [run_id],
	});

	const task_results_data: TaskResult[] =
		task_results_result.rows.map((row) => ({
			task_result_id: Number(row.task_result_id),
			run_id: Number(row.run_id),
			benchmark_name: String(row.benchmark_name),
			status: row.status as 'pass' | 'fail' | 'error', // Cast to the correct union type
			duration_ms: Number(row.duration_ms),
			generated_code: String(row.generated_code),
			test_output: String(row.test_output),
			error_message: row.error_message
				? String(row.error_message)
				: undefined, // Handle optional error_message
		}));

	// Combine the results into a single object matching the RunDetailsWithTasks interface
	const benchmark_run_details: RunDetailsWithTasks = {
		run_id: Number(run_data.run_id),
		llm_model: String(run_data.llm_model),
		timestamp: String(run_data.timestamp),
		total_duration_ms: Number(run_data.total_duration_ms),
		total_tasks: Number(run_data.total_tasks),
		passed_tasks: Number(run_data.passed_tasks),
		failed_tasks: Number(run_data.failed_tasks),
		error_tasks: Number(run_data.error_tasks),
		overall_status: String(run_data.overall_status),
		model_name: run_data.model_name
			? String(run_data.model_name)
			: undefined, // Handle optional model_name
		task_results: task_results_data,
	};

	return benchmark_run_details;
}
