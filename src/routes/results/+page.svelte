<!-- src/routes/results/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData; // TODO: Display the list of benchmark runs from data.runs
	}

	let { data }: Props = $props();
</script>

<h1>Benchmark Runs</h1>

<!-- Example list structure -->
<ul>
	{#each data.runs as run}
		<li>
			<a href={`/results/${run.run_id}`}>
				Run {run.run_id}: {run.llm_model} on {new Date(
					run.timestamp,
				).toLocaleString()} - {run.overall_status}
			</a>
		</li>
	{/each}
</ul>

<style>
	/* Add some basic styling */
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		margin-bottom: 10px;
		border: 1px solid #ccc;
		padding: 10px;
		border-radius: 4px;
	}
	a {
		text-decoration: none;
		color: inherit;
		display: block;
	}
</style>
