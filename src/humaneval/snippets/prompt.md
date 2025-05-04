# Snippets Benchmark Prompt

In Svelte 5 runes mode, `{#snippet}` blocks are used to pass reusable
pieces of template from a parent component to a child component. There
are specific rules and limitations for using snippets:

- `{#snippet ...}` blocks have invalid placement rules (e.g., where
  they can appear).
- You cannot reference variables from outside the snippet's scope
  unless they are explicitly passed as snippet parameters
  (`snippet_invalid_reference`).
- A snippet name cannot be defined more than once
  (`snippet_duplicate`).

Write a Svelte component that defines and uses a `{#snippet}` block,
demonstrating how to pass data into the snippet using parameters.

Provide the Svelte code within a single markdown code block.
