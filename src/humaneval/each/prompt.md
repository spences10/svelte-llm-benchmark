# Each Benchmark Prompt

In Svelte 5 runes mode, you cannot directly assign to a variable declared in an `{#each}` block like this:

```svelte
{#each array as entry}
 entry = 4}>change
{/each}
```

This is because it can be buggy and unpredictable, especially with derived values.

Write a Svelte component that demonstrates how to correctly update an item within an array in an `{#each}` block using the item's index.

Provide the Svelte code within a single markdown code block.
