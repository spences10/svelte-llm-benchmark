# Derived Benchmark Prompt

Write a TypeScript function `calculate_text_stats` that takes a string
as input.

The function should return an object with the following properties:

1.  `word_count`: The number of words in the string (words are
    separated by spaces).
2.  `char_count`: The total number of characters in the string.
3.  `is_long`: A boolean indicating if the `char_count` is greater
    than 50.

Handle empty strings and strings with only whitespace correctly
(word_count should be 0).

The function should be exported.
