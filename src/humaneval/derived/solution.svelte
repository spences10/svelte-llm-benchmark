<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2); // Derived value

  function increment() {
    count++;
  }
</script>

<div>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  <button onclick={increment}>Increment Count</button>
</div>
