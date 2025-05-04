<!-- src/routes/+page.svelte -->
<script lang="ts">
	let benchmark_status: 'idle' | 'running' | 'complete' | 'error' =
		$state('idle');
	let benchmark_message = $state('');
	let run_result: any = $state(null); // To store the result from the API

	async function run_hello_world_benchmark() {
		benchmark_status = 'running';
		benchmark_message = 'Running "hello-world" benchmark...';
		run_result = null;

		const benchmark_name = 'hello-world';
		const model_id = 'openai/gpt-4.5-preview'; // As requested

		try {
			const response = await fetch(
				`/api/run-humaneval/${benchmark_name}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ model_id }),
				},
			);

			const result = await response.json();

			if (response.ok) {
				benchmark_status = 'complete';
				benchmark_message = `Benchmark completed: ${result.message}`;
				run_result = result.result;
				console.log('Benchmark API response:', result);
			} else {
				benchmark_status = 'error';
				benchmark_message = `Benchmark failed: ${result.message || response.statusText}`;
				run_result = result.run_result || null;
				console.error('Benchmark API error response:', result);
			}
		} catch (error: any) {
			benchmark_status = 'error';
			benchmark_message = `An error occurred while running the benchmark: ${error.message}`;
			run_result = null;
			console.error('Benchmark fetch error:', error);
		}
	}
</script>

<h1>Svelte LLM Benchmark</h1>

<p>
	This application benchmarks Large Language Models on Svelte
	component generation tasks.
</p>

<h2>Run Benchmarks</h2>

<button
	onclick={run_hello_world_benchmark}
	disabled={benchmark_status === 'running'}
>
	{#if benchmark_status === 'running'}
		Running...
	{:else}
		Run Hello World Benchmark (openai/gpt-4.5-preview)
	{/if}
</button>

{#if benchmark_status !== 'idle'}
	<div>
		<p>Status: {benchmark_status}</p>
		<p>{benchmark_message}</p>

		{#if run_result}
			<h3>Run Result Summary:</h3>
			<p>Benchmark: {run_result.benchmark_name}</p>
			<p>Model: {run_result.model_name}</p>
			<p>Status: {run_result.status}</p>
			<p>Duration: {run_result.duration_ms} ms</p>
			{#if run_result.error_message}
				<p>Error Message: {run_result.error_message}</p>
			{/if}
			<p>
				<a href={`/results/${run_result.run_id}`}>View Full Details</a
				>
			</p>
		{/if}
	</div>
{/if}

<h2>View Results</h2>
<p>
	Visit the <a href="/results">Results Page</a> to see all recorded benchmark
	runs.
</p>

<style>
	/* Add some basic styling */
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
