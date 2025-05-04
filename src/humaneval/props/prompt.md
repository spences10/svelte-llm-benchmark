# Props Benchmark Prompt

In Svelte 5 runes mode, component properties are declared using the
`$props()` rune. There are specific rules and limitations for using
`$props()`:

- `$props()` can only be used at the top level of components as a
  variable declaration initializer.
- It must be used with an object destructuring pattern.
- The assignment must not contain nested properties or computed keys.
- Declaring or accessing a prop starting with `$$` is illegal (they
  are reserved for Svelte internals).
- `$props.id()` has specific placement rules.
- `$props()` cannot be used more than once.

Write a Svelte component that correctly declares and uses properties
passed from a parent component using the `$props()` rune.

Provide the Svelte code within a single markdown code block.
