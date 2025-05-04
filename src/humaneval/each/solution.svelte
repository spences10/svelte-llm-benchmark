<script lang="ts">
  let items = $state([1, 2, 3, 4, 5]);

  function update_item(index: number, value: number) {
    items[index] = value;
    // Svelte 5 reactivity for array updates requires reassigning the array
    items = [...items];
  }
</script>

{#each items as item, index (index)}
  <div>
    Item {index}: {item}
    <button onclick={() => update_item(index, item * 2)}>Double</button>
  </div>
{/each}
