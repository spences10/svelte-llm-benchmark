import { exec } from 'node:child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { LLMClient } from './llm_clients/types';

interface BenchmarkResult {
	benchmark_name: string;
	status: 'pass' | 'fail' | 'error';
	duration_ms: number;
	generated_code: string;
	test_output: string; // Or a more structured type for test results
	error_message?: string;
}

/**
 * Runs a single benchmark task against a specific LLM model.
 * @param benchmark_name The name of the benchmark task (e.g., 'hello-world').
 * @param llm_client The LLM client instance to use.
 * @param model_name The name of the LLM model to benchmark.
 * @returns A promise resolving to the benchmark result.
 */
export async function run_benchmark_task(
	benchmark_name: string,
	llm_client: LLMClient,
	model_name: string,
): Promise<BenchmarkResult> {
	const start_time = Date.now();
	let status: BenchmarkResult['status'] = 'error';
	let generated_code = '';
	let test_output = '';
	let error_message: string | undefined;

	try {
		// 1. Read the prompt.md for the specified benchmark task.
		const prompt_path = join(
			process.cwd(),
			'src',
			'humaneval',
			benchmark_name,
			'prompt.md',
		);
		const prompt_content = readFileSync(prompt_path, 'utf-8');

		// 2. Call the LLM client to generate code based on the prompt.
		generated_code = await llm_client.generate_code(
			prompt_content,
			model_name,
		);

		// 3. Execute the corresponding solution.test.ts against the generated code.
		const test_result = await execute_test(
			benchmark_name,
			generated_code,
		);
		status = test_result.status;
		test_output = test_result.output;
	} catch (error: any) {
		error_message = error.message;
		status = 'error';
	} finally {
		const duration_ms = Date.now() - start_time;
		return {
			benchmark_name,
			status,
			duration_ms,
			generated_code,
			test_output,
			error_message,
		};
	}
}

const exec_promise = promisify(exec);

// TODO: Implement execute_test function
async function execute_test(
	benchmark_name: string,
	generated_code: string,
): Promise<{ status: 'pass' | 'fail'; output: string }> {
	const temp_file_path = join(
		process.cwd(),
		`temp_solution_${Date.now()}.svelte`,
	); // Changed extension to .svelte
	const test_file_path = join(
		process.cwd(),
		'src',
		'humaneval',
		benchmark_name,
		'solution.test.ts',
	);
	let output = '';
	let status: 'pass' | 'fail' = 'fail';

	try {
		// Write the generated code to a temporary file
		writeFileSync(temp_file_path, generated_code, 'utf-8');

		// Execute the test file using Vitest CLI
		// We pass the path to the generated code via an environment variable
		const command = `npx vitest run ${test_file_path}`;
		const { stdout, stderr } = await exec_promise(command, {
			env: { ...process.env, GENERATED_CODE_PATH: temp_file_path },
		});

		output = stdout + stderr;

		// Parse the output to determine status
		if (stdout.includes('✓ pass')) {
			// Basic check for passing tests
			status = 'pass';
		} else {
			status = 'fail';
		}
	} catch (error: any) {
		output = `Error executing tests: ${error.message}\n${error.stdout || ''}\n${error.stderr || ''}`;
		status = 'fail';
	} finally {
		// Clean up the temporary file
		try {
			unlinkSync(temp_file_path);
		} catch (cleanup_error) {
			console.error(
				`Error cleaning up temporary file ${temp_file_path}:`,
				cleanup_error,
			);
		}
	}

	return { status, output };
}

// TODO: Define LLMClient type if not already in src/lib/llm_clients/types.ts
// interface LLMClient {
//   generate_code(prompt: string, model: string): Promise<string>;
// }
