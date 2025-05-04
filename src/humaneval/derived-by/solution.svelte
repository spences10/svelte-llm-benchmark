<script lang="ts">
  // Svelte component that includes and exports the calculate_text_stats function

  /**
   * Calculates text statistics.
   * @param text The input string.
   * @returns An object with word_count, char_count, and is_long.
   */
  export function calculate_text_stats(text: string): { word_count: number; char_count: number; is_long: boolean } {
    const word_count = text.split(/\s+/).filter(word => word.length > 0).length;
    const char_count = text.length;
    const is_long = char_count > 50;
    return { word_count, char_count, is_long };
  }

  // The component itself doesn't need to render anything specific for this benchmark,
  // as the test directly calls the exported function.
</script>

<!-- The component template can be empty or minimal -->
<div></div>
