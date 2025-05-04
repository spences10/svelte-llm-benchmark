<script lang="ts">
	let count = $state(0);

	$effect(() => {
		console.log('Count changed:', count);
		// Example side effect: update document title
		if (typeof document !== 'undefined') {
			// Check if running in browser
			document.title = `Count: ${count}`;
		}
	});

	// Optional: Increment count on button click to demonstrate reactivity
	function increment() {
		count++;
	}
</script>

<div>
	<p>Count: {count}</p>
	<button onclick={increment}>Increment</button>
</div>
