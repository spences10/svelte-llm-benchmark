export interface PriceInput {
	price: number;
	discount_percentage?: number;
}

export interface DiscountResult {
	price: number;
	discount_percentage: number;
	discount_amount: number;
	final_price: number;
}

export function calculate_discounted_price(
	input: PriceInput,
): DiscountResult {
	const price = input.price;
	let discount_percentage = input.discount_percentage ?? 0; // Default to 0 if missing

	// Clamp discount_percentage between 0 and 100
	if (discount_percentage < 0) {
		discount_percentage = 0;
	} else if (discount_percentage > 100) {
		discount_percentage = 100;
	}

	const discount_amount = price * (discount_percentage / 100);
	const final_price = price - discount_amount;

	return {
		price: price,
		discount_percentage: discount_percentage,
		discount_amount: discount_amount,
		final_price: final_price,
	};
}
