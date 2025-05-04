<script lang="ts">
  // Child component that expects and renders a snippet prop
  let { mySnippet } = $props(); // Expecting a snippet prop

  // Example data to pass to the snippet
  let message = "Hello from child!";
</script>

<div>
  <h3>Child Component</h3>
  {#if mySnippet}
    {@render mySnippet(message)} <!-- Render the snippet, passing data -->
  {:else}
    <p>No snippet provided.</p>
  {/if}
</div>
