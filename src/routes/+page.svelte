<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let benchmark_status: 'idle' | 'running' | 'complete' | 'error' =
		$state('idle');
	let benchmark_message = $state('');
	let run_result: any = $state(null); // To store the result from the API

	let available_models: { id: string; name: string }[] = $state([]);
	let selected_model_id: string = $state('');

	// New state for filtering
	let model_input_value: string = $state('');
	let filtered_models: { id: string; name: string }[] = $state([]);
	let show_suggestions: boolean = $state(false);

	onMount(async () => {
		try {
			const response = await fetch('/api/models');
			if (response.ok) {
				const models = await response.json();
				available_models = models;
				// Initially show all models or a subset, or none until typing
				// Let's start by showing none until typing
				filtered_models = []; // Or available_models.slice(0, 10);
				// if (available_models.length > 0) { // Don't auto-select on load with input
				// 	selected_model_id = available_models[0].id;
				// }
			} else {
				console.error('Failed to fetch models:', response.statusText);
				// Handle error fetching models
			}
		} catch (error) {
			console.error('Error fetching models:', error);
			// Handle error fetching models
		}
	});

	// Function to filter models based on input
	function filter_models() {
		if (!model_input_value) {
			filtered_models = []; // Or available_models.slice(0, 10);
			show_suggestions = false;
			selected_model_id = ''; // Clear selected model if input is cleared
			return;
		}
		const lower_input = model_input_value.toLowerCase();
		filtered_models = available_models.filter(
			(model) =>
				model.name.toLowerCase().includes(lower_input) ||
				model.id.toLowerCase().includes(lower_input),
		);
		show_suggestions = filtered_models.length > 0;
		// Clear selected model if the current input doesn't exactly match a model name/id
		if (
			!available_models.some(
				(model) =>
					model.name === model_input_value ||
					model.id === model_input_value,
			)
		) {
			selected_model_id = '';
		} else {
			// If input matches exactly, find and set the selected_model_id
			const matched_model = available_models.find(
				(model) =>
					model.name === model_input_value ||
					model.id === model_input_value,
			);
			if (matched_model) {
				selected_model_id = matched_model.id;
			}
		}
	}

	// Function to select a model from suggestions
	function select_model(model: { id: string; name: string }) {
		selected_model_id = model.id;
		model_input_value = model.name; // Set input value to selected model name
		show_suggestions = false; // Hide suggestions
	}

	// Handle input blur to hide suggestions, but with a slight delay
	// to allow click on suggestion
	let blur_timeout: ReturnType<typeof setTimeout>;
	function handle_blur() {
		blur_timeout = setTimeout(() => {
			show_suggestions = false;
		}, 100); // Adjust delay as needed
	}

	function handle_focus() {
		clearTimeout(blur_timeout);
		// Show suggestions on focus if input is not empty
		if (model_input_value) {
			filter_models(); // Re-filter and show if input has value
			show_suggestions = filtered_models.length > 0;
		} else {
			// Optionally show a default list or recent selections on focus when input is empty
			// For now, just show all models on focus when input is empty
			filtered_models = available_models;
			show_suggestions = available_models.length > 0;
		}
	}

	async function run_all_benchmarks() {
		if (!selected_model_id) {
			alert(
				'Please select a model by typing and choosing from suggestions.',
			);
			return;
		}

		benchmark_status = 'running';
		benchmark_message = `Running all benchmarks with model: ${selected_model_id}...`;
		run_result = null; // Clear previous single run result

		try {
			const response = await fetch('/api/run-all-humaneval', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ model_id: selected_model_id }),
			});

			const result = await response.json();

			if (response.ok) {
				benchmark_status = 'complete';
				benchmark_message = `Full benchmark run completed: ${result.message}`;
				// Assuming the response includes the run_id
				if (result.run_id) {
					// Redirect to the detailed results page for the new run
					goto(`/results/${result.run_id}`);
				}
			} else {
				benchmark_status = 'error';
				benchmark_message = `Full benchmark run failed: ${result.error || response.statusText}`;
				console.error('Full benchmark API error response:', result);
			}
		} catch (error: any) {
			benchmark_status = 'error';
			benchmark_message = `An error occurred while running all benchmarks: ${error.message}`;
			console.error('Full benchmark fetch error:', error);
		}
	}

	// Keep the single benchmark function but update it to use the selected model
	async function run_hello_world_benchmark() {
		if (!selected_model_id) {
			alert('Please select a model.');
			return;
		}

		benchmark_status = 'running';
		benchmark_message = `Running "hello-world" benchmark with model: ${selected_model_id}...`;
		run_result = null;

		const benchmark_name = 'hello-world';
		// Use the selected model_id instead of hardcoded
		const model_id = selected_model_id;

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
				run_result = result.result; // Assuming single run endpoint returns result summary
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

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Svelte LLM Benchmark</h1>

	<p class="mb-6">
		This application benchmarks Large Language Models on Svelte
		component generation tasks.
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Run Benchmarks</h2>

	{#if available_models.length > 0}
		<div class="form-control model-select-container w-full max-w-xs">
			<label class="label" for="model-input">
				<span class="label-text">Select Model:</span>
			</label>
			<input
				id="model-input"
				type="text"
				class="input input-bordered w-full"
				bind:value={model_input_value}
				oninput={filter_models}
				onfocus={handle_focus}
				onblur={handle_blur}
				placeholder="Type to search models..."
			/>
			{#if show_suggestions}
				<ul
					class="suggestions-list menu bg-base-100 rounded-box z-[1] w-full p-2 shadow"
				>
					{#each filtered_models as model (model.id)}
						<li>
							<button
								onmousedown={() => select_model(model)}
								class="btn btn-ghost w-full justify-start"
							>
								{model.name} ({model.id})
							</button>
						</li>
					{/each}
					{#if filtered_models.length === 0 && model_input_value}
						<li>
							<span class="text-gray-500"
								>No models found matching "{model_input_value}"</span
							>
						</li>
					{/if}
				</ul>
			{/if}
		</div>
	{/if}

	<button
		class="btn btn-primary mb-2"
		onclick={run_all_benchmarks}
		disabled={benchmark_status === 'running' || !selected_model_id}
	>
		{#if benchmark_status === 'running'}
			Running All...
		{:else}
			Run All Benchmarks
		{/if}
	</button>

	<!-- Keep the single run button for now, updated to use selected model -->
	<button
		class="btn btn-secondary mb-2"
		onclick={run_hello_world_benchmark}
		disabled={benchmark_status === 'running' || !selected_model_id}
	>
		{#if benchmark_status === 'running'}
			Running Hello World...
		{:else}
			Run Hello World Benchmark ({selected_model_id ||
				'Select Model'})
		{/if}
	</button>

	{#if benchmark_status !== 'idle'}
		<div
			class="alert mb-4 {benchmark_status === 'running'
				? 'alert-info'
				: benchmark_status === 'complete'
					? 'alert-success'
					: benchmark_status === 'error'
						? 'alert-error'
						: ''}"
		>
			<p>Status: {benchmark_status}</p>
			<p>{benchmark_message}</p>

			{#if run_result}
				<div class="mt-4">
					<!-- Add margin top to separate summary -->
					<h3 class="text-lg font-semibold">Run Result Summary:</h3>
					<p>Benchmark: {run_result.benchmark_name}</p>
					<p>Model: {run_result.model_name}</p>
					<p>Status: {run_result.status}</p>
					<p>Duration: {run_result.duration_ms} ms</p>
					{#if run_result.error_message}
						<p>Error Message: {run_result.error_message}</p>
					{/if}
					<p class="mt-2">
						<!-- Add margin top to the link -->
						<a
							href={`/results/${run_result.run_id}`}
							class="link link-primary">View Full Details</a
						>
					</p>
				</div>
			{/if}
		</div>
	{/if}

	<h2 class="mt-6 mb-3 text-2xl font-semibold">View Results</h2>
	<!-- Added mt-6 for spacing -->
	<p class="mb-4">
		<!-- Added mb-4 -->
		Visit the
		<a href="/results" class="link link-primary">Results Page</a> to see
		all recorded benchmark runs.
	</p>
</div>
