// src/routes/results/[run_id]/+page.server.ts
import { get_benchmark_run_details } from '$lib/server/db';
import type { RunDetailsWithTasks } from '$lib/types'; // Import from shared types
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const run_id = Number(params.run_id);

	// Fetch detailed benchmark run data and task results from Turso database based on run_id
	const benchmark_run_details: RunDetailsWithTasks | null =
		await get_benchmark_run_details(run_id);

	return {
		run: benchmark_run_details,
	};
};
