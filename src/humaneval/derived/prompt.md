# Derived Benchmark Prompt

In Svelte 5 runes mode, the legacy reactive statement `$:` is not
allowed. You should use `$derived` for computed values and `$effect`
for side effects.

Write a Svelte component that demonstrates the use of the `$derived`
rune to create a computed value that automatically updates when its
dependencies change. For example, derive a `doubled` value from a
`count` state variable.

Provide the Svelte code within a single markdown code block.
