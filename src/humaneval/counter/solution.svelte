<script lang="ts">
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<div>
  <button onclick={increment}>count is {count}</button>
</div>
