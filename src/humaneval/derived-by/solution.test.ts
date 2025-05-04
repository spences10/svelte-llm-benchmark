import '@testing-library/jest-dom'; // Import jest-dom matchers
import { render, screen } from '@testing-library/svelte'; // Import testing utilities
import { describe, expect, it } from 'vitest';

// Unit tests for the 'derived-by' benchmark solution.
// These tests verify the functional correctness based on prompt.md

// Define the expected input and output types based on the prompt
interface PriceInput {
	price: number;
	discount_percentage?: number; // Optional as per prompt
}

interface DiscountResult {
	price: number;
	discount_percentage: number; // Should always be present in the result (0-100)
	discount_amount: number;
	final_price: number;
}

// Dynamically import the generated component from the temporary file path
const generated_code_path = process.env.GENERATED_CODE_PATH;

// Ensure the environment variable is set
if (!generated_code_path) {
	throw new Error(
		'GENERATED_CODE_PATH environment variable is not set.',
	);
}

// Dynamically import the generated Svelte component
const GeneratedComponent = (await import(generated_code_path))
	.default;

describe('derived-by benchmark tests (component)', () => {
	// Updated describe block name

	// Adapt tests to render the component and check rendered output
	// Assuming the component takes the PriceInput object as a 'data' prop
	// and renders the DiscountResult values in elements with data-testid attributes
	// like 'price', 'discount-percentage', 'discount-amount', 'final-price'

	it('should calculate and display discount correctly with valid percentage', async () => {
		// Added async
		const input: PriceInput = { price: 100, discount_percentage: 20 };
		const expected: DiscountResult = {
			price: 100,
			discount_percentage: 20,
			discount_amount: 20,
			final_price: 80,
		};

		// Render the component with the input as a prop
		render(GeneratedComponent, { props: { data: input } });

		// Check the rendered output
		expect(screen.getByTestId('price')).toHaveTextContent(
			String(expected.price),
		);
		expect(
			screen.getByTestId('discount-percentage'),
		).toHaveTextContent(String(expected.discount_percentage));
		expect(screen.getByTestId('discount-amount')).toHaveTextContent(
			String(expected.discount_amount),
		);
		expect(screen.getByTestId('final-price')).toHaveTextContent(
			String(expected.final_price),
		);
	});

	it('should handle and display stats for missing discount_percentage (assume 0)', async () => {
		// Added async
		const input: PriceInput = { price: 50 };
		const expected: DiscountResult = {
			price: 50,
			discount_percentage: 0,
			discount_amount: 0,
			final_price: 50,
		};

		render(GeneratedComponent, { props: { data: input } });

		expect(screen.getByTestId('price')).toHaveTextContent(
			String(expected.price),
		);
		expect(
			screen.getByTestId('discount-percentage'),
		).toHaveTextContent(String(expected.discount_percentage));
		expect(screen.getByTestId('discount-amount')).toHaveTextContent(
			String(expected.discount_amount),
		);
		expect(screen.getByTestId('final-price')).toHaveTextContent(
			String(expected.final_price),
		);
	});

	it('should handle and display stats for negative discount_percentage (treat as 0)', async () => {
		// Added async
		const input: PriceInput = {
			price: 200,
			discount_percentage: -10,
		};
		const expected: DiscountResult = {
			price: 200,
			discount_percentage: 0, // Clamped to 0
			discount_amount: 0,
			final_price: 200,
		};

		render(GeneratedComponent, { props: { data: input } });

		expect(screen.getByTestId('price')).toHaveTextContent(
			String(expected.price),
		);
		expect(
			screen.getByTestId('discount-percentage'),
		).toHaveTextContent(String(expected.discount_percentage));
		expect(screen.getByTestId('discount-amount')).toHaveTextContent(
			String(expected.discount_amount),
		);
		expect(screen.getByTestId('final-price')).toHaveTextContent(
			String(expected.final_price),
		);
	});

	it('should handle and display stats for discount_percentage greater than 100 (treat as 100)', async () => {
		// Added async
		const input: PriceInput = {
			price: 150,
			discount_percentage: 120,
		};
		const expected: DiscountResult = {
			price: 150,
			discount_percentage: 100, // Clamped to 100
			discount_amount: 150,
			final_price: 0,
		};

		render(GeneratedComponent, { props: { data: input } });

		expect(screen.getByTestId('price')).toHaveTextContent(
			String(expected.price),
		);
		expect(
			screen.getByTestId('discount-percentage'),
		).toHaveTextContent(String(expected.discount_percentage));
		expect(screen.getByTestId('discount-amount')).toHaveTextContent(
			String(expected.discount_amount),
		);
		expect(screen.getByTestId('final-price')).toHaveTextContent(
			String(expected.final_price),
		);
	});

	it('should handle and display stats for zero price correctly', async () => {
		// Added async
		const input: PriceInput = { price: 0, discount_percentage: 50 };
		const expected: DiscountResult = {
			price: 0,
			discount_percentage: 50,
			discount_amount: 0,
			final_price: 0,
		};

		render(GeneratedComponent, { props: { data: input } });

		expect(screen.getByTestId('price')).toHaveTextContent(
			String(expected.price),
		);
		expect(
			screen.getByTestId('discount-percentage'),
		).toHaveTextContent(String(expected.discount_percentage));
		expect(screen.getByTestId('discount-amount')).toHaveTextContent(
			String(expected.discount_amount),
		);
		expect(screen.getByTestId('final-price')).toHaveTextContent(
			String(expected.final_price),
		);
	});

	it('should handle and display stats for floating point prices and percentages', async () => {
		// Added async
		const input: PriceInput = {
			price: 123.45,
			discount_percentage: 15.5,
		};
		const expected_discount = 123.45 * (15.5 / 100);
		const expected_final = 123.45 - expected_discount;
		// Use closeTo for floating point comparisons - need to read text content and parse as number
		// expect(result.price).toBeCloseTo(123.45);
		// expect(result.discount_percentage).toBeCloseTo(15.5);
		// expect(result.discount_amount).toBeCloseTo(expected_discount);
		// expect(result.final_price).toBeCloseTo(expected_final);

		render(GeneratedComponent, { props: { data: input } });

		expect(
			Number(screen.getByTestId('price').textContent),
		).toBeCloseTo(123.45);
		expect(
			Number(screen.getByTestId('discount-percentage').textContent),
		).toBeCloseTo(15.5);
		expect(
			Number(screen.getByTestId('discount-amount').textContent),
		).toBeCloseTo(expected_discount);
		expect(
			Number(screen.getByTestId('final-price').textContent),
		).toBeCloseTo(expected_final);
	});
});
