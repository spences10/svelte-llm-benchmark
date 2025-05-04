<!-- src/routes/results/[run_id]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData; // TODO: Display detailed benchmark run data and task results from data.run
	}

	let { data }: Props = $props();
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Run Details</h1>

	{#if data.run}
		<div class="rounded-box bg-base-100 mb-6 border p-4 shadow">
			<!-- Styled overall run details -->
			<p class="mb-1"><strong>Run ID:</strong> {data.run.run_id}</p>
			<p class="mb-1"><strong>Model:</strong> {data.run.llm_model}</p>
			<p class="mb-1">
				<strong>Timestamp:</strong>
				{new Date(data.run.timestamp).toLocaleString()}
			</p>
			<p class="mb-1">
				<strong>Overall Status:</strong>
				<span
					class={data.run.overall_status === 'passed'
						? 'text-success'
						: data.run.overall_status === 'failed'
							? 'text-error'
							: 'text-warning'}>{data.run.overall_status}</span
				>
			</p>
			<!-- Styled status -->
			<p class="mb-1">
				<strong>Duration:</strong>
				{data.run.total_duration_ms} ms
			</p>
			<p>
				<strong>Tasks:</strong>
				{data.run.total_tasks} (Passed:
				<span class="text-success">{data.run.passed_tasks}</span>,
				Failed:
				<span class="text-error">{data.run.failed_tasks}</span>,
				Errors:
				<span class="text-warning">{data.run.error_tasks}</span>) <!-- Styled task counts -->
			</p>
		</div>

		<h2 class="mb-3 text-2xl font-semibold">Task Results</h2>

		{#if data.run.task_results && data.run.task_results.length > 0}
			<ul>
				{#each data.run.task_results as task_result (task_result.task_result_id)}
					<!-- Added key -->
					<li class="rounded-box bg-base-100 mb-6 border p-4 shadow">
						<!-- Styled task result item -->
						<h3 class="mb-2 text-xl font-semibold">
							Benchmark: {task_result.benchmark_name}
						</h3>
						<!-- Styled task name -->
						<p class="mb-1">
							Status: <span
								class={task_result.status === 'pass'
									? 'text-success'
									: task_result.status === 'fail'
										? 'text-error'
										: 'text-warning'}>{task_result.status}</span
							>
						</p>
						<!-- Styled status -->
						<p class="mb-3">Duration: {task_result.duration_ms} ms</p>

						{#if task_result.error_message}
							<div class="alert alert-error mb-4">
								<!-- Styled error message -->
								<p>Error: {task_result.error_message}</p>
							</div>
						{/if}

						<h4 class="mb-2 text-lg font-semibold">
							Generated Code:
						</h4>
						<div class="mockup-code mb-4">
							<!-- Styled code block -->
							<pre><code>{task_result.generated_code}</code></pre>
						</div>

						<h4 class="mb-2 text-lg font-semibold">Test Output:</h4>
						<div class="mockup-code">
							<!-- Styled test output block -->
							<pre><code>{task_result.test_output}</code></pre>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No task results available for this run.</p>
		{/if}
	{:else}
		<p>Loading run details...</p>
	{/if}
</div>
