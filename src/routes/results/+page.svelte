<!-- src/routes/results/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData; // TODO: Display the list of benchmark runs from data.runs
	}

	let { data }: Props = $props();
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Benchmark Runs</h1>

	<!-- Example list structure -->
	{#if data.runs && data.runs.length > 0}
		<ul>
			{#each data.runs as run (run.run_id)}
				<!-- Added key for better performance/animations -->
				<li class="mb-2 rounded border p-4">
					<a
						href={`/results/${run.run_id}`}
						class="link link-hover block"
					>
						<!-- Added block to make link fill li -->
						<p class="mb-1 text-lg font-semibold">
							Run {run.run_id}: {run.llm_model}
						</p>
						<p class="mb-1 text-sm text-gray-600">
							on {new Date(run.timestamp).toLocaleString()}
						</p>
						<p class="text-md">
							Status: <span
								class={run.overall_status === 'passed'
									? 'text-success'
									: run.overall_status === 'failed'
										? 'text-error'
										: 'text-warning'}>{run.overall_status}</span
							>
						</p>
						<!-- Styled status -->
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No benchmark runs available yet.</p>
	{/if}
</div>
