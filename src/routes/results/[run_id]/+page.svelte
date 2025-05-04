<!-- src/routes/results/[run_id]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData; // TODO: Display detailed benchmark run data and task results from data.run
	}

	let { data }: Props = $props();
</script>

<h1>Benchmark Run Details</h1>

{#if data.run}
	<div>
		<p>Run ID: {data.run.run_id}</p>
		<p>Model: {data.run.llm_model}</p>
		<p>Timestamp: {new Date(data.run.timestamp).toLocaleString()}</p>
		<p>Overall Status: {data.run.overall_status}</p>
		<p>Duration: {data.run.total_duration_ms} ms</p>
		<p>
			Tasks: {data.run.total_tasks} (Passed: {data.run.passed_tasks},
			Failed: {data.run.failed_tasks}, Errors: {data.run.error_tasks})
		</p>

		<h2>Task Results</h2>
		{#if data.run.task_results && data.run.task_results.length > 0}
			<ul>
				{#each data.run.task_results as task_result}
					<li>
						<h3>{task_result.benchmark_name}</h3>
						<p>Status: {task_result.status}</p>
						<p>Duration: {task_result.duration_ms} ms</p>
						{#if task_result.error_message}
							<p>Error: {task_result.error_message}</p>
						{/if}
						<h4>Generated Code:</h4>
						<pre><code>{task_result.generated_code}</code></pre>
						<h4>Test Output:</h4>
						<pre><code>{task_result.test_output}</code></pre>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No task results available for this run.</p>
		{/if}
	</div>
{:else}
	<p>Loading run details...</p>
{/if}

<style>
	/* Add some basic styling */
	pre {
		background-color: #f4f4f4;
		padding: 10px;
		border-radius: 4px;
		overflow-x: auto;
	}
	code {
		font-family:
			Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		margin-bottom: 20px;
		border: 1px solid #ccc;
		padding: 15px;
		border-radius: 4px;
	}
</style>
