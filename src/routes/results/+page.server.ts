// src/routes/results/+page.server.ts
import { get_benchmark_runs } from '$lib/server/db';
import type { BenchmarkRun } from '$lib/types'; // Import from shared types
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	// Fetch benchmark run data from Turso database
	const benchmark_runs: BenchmarkRun[] = await get_benchmark_runs();

	return {
		runs: benchmark_runs,
	};
};
