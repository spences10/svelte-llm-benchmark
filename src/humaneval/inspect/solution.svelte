<script lang="ts">
  let count = $state(0);

  function increment() {
    $inspect.trace('Incrementing count'); // Trace before increment
    count++;
    // Remove the second $inspect.trace call
  }

  $effect(() => {
    $inspect.trace('Count effect triggered'); // Trace when effect runs
  });
</script>

<div>
  <p>Count: {count}</p>
  <button onclick={increment}>Increment and Trace</button>
</div>
