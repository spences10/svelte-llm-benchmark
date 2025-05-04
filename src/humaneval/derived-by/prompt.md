# Derived-By Benchmark Prompt

Write a TypeScript function `calculate_discounted_price` that takes an
object with `price` (number) and `discount_percentage` (number)
properties.

The function should:

1.  Calculate the discount amount
    (`price * (discount_percentage / 100)`).
2.  Calculate the final price (`price - discount_amount`).
3.  Return an object containing the original `price`, the
    `discount_percentage`, the calculated `discount_amount`, and the
    `final_price`.
4.  Handle cases where `discount_percentage` might be missing (assume
    0 discount), negative (treat as 0), or greater than 100 (treat as
    100).

The function should be exported.
