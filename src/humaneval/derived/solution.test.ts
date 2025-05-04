import '@testing-library/jest-dom'; // Import jest-dom matchers
import { render, screen } from '@testing-library/svelte'; // Import testing utilities
import { describe, expect, it } from 'vitest';

// Unit tests for the 'derived' benchmark solution.
// These tests verify the functional correctness based on prompt.md

// Define the expected output type based on the prompt
interface TextStats {
	word_count: number;
	char_count: number;
	is_long: boolean;
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

describe('derived benchmark tests (component)', () => {
	// Updated describe block name

	// Adapt tests to render the component and check rendered output
	// Assuming the component takes the input string as a 'text' prop
	// and renders the word_count, char_count, and is_long status in elements
	// with data-testid attributes like 'word-count', 'char-count', 'is-long'

	it('should calculate and display stats for a simple sentence', async () => {
		// Added async
		const input = 'Hello world, this is a test.';
		const expected: TextStats = {
			word_count: 6,
			char_count: 27,
			is_long: false,
		};

		// Render the component with the input as a prop
		render(GeneratedComponent, { props: { text: input } });

		// Check the rendered output
		expect(screen.getByTestId('word-count')).toHaveTextContent(
			String(expected.word_count),
		);
		expect(screen.getByTestId('char-count')).toHaveTextContent(
			String(expected.char_count),
		);
		expect(screen.getByTestId('is-long')).toHaveTextContent(
			String(expected.is_long),
		);
	});

	it('should calculate and display stats for a longer sentence', async () => {
		// Added async
		const input =
			'This is a much longer sentence designed to exceed the fifty character limit for testing purposes.';
		const expected: TextStats = {
			word_count: 16,
			char_count: 101,
			is_long: true,
		};

		render(GeneratedComponent, { props: { text: input } });

		expect(screen.getByTestId('word-count')).toHaveTextContent(
			String(expected.word_count),
		);
		expect(screen.getByTestId('char-count')).toHaveTextContent(
			String(expected.char_count),
		);
		expect(screen.getByTestId('is-long')).toHaveTextContent(
			String(expected.is_long),
		);
	});

	it('should handle and display stats for an empty string', async () => {
		// Added async
		const input = '';
		const expected: TextStats = {
			word_count: 0,
			char_count: 0,
			is_long: false,
		};

		render(GeneratedComponent, { props: { text: input } });

		expect(screen.getByTestId('word-count')).toHaveTextContent(
			String(expected.word_count),
		);
		expect(screen.getByTestId('char-count')).toHaveTextContent(
			String(expected.char_count),
		);
		expect(screen.getByTestId('is-long')).toHaveTextContent(
			String(expected.is_long),
		);
	});

	it('should handle and display stats for a string with only whitespace', async () => {
		// Added async
		const input = '   \t \n  ';
		const expected: TextStats = {
			word_count: 0,
			char_count: 8,
			is_long: false,
		};

		render(GeneratedComponent, { props: { text: input } });

		expect(screen.getByTestId('word-count')).toHaveTextContent(
			String(expected.word_count),
		);
		expect(screen.getByTestId('char-count')).toHaveTextContent(
			String(expected.char_count),
		);
		expect(screen.getByTestId('is-long')).toHaveTextContent(
			String(expected.is_long),
		);
	});

	it('should handle and display stats for a string with leading/trailing whitespace', async () => {
		// Added async
		const input = '  Trim me!  ';
		const expected: TextStats = {
			word_count: 2,
			char_count: 12,
			is_long: false,
		};

		render(GeneratedComponent, { props: { text: input } });

		// Note: The prompt implies word count based on spaces,
		// so the exact behavior for leading/trailing spaces might depend on the LLM's split logic.
		// This test assumes a simple split(' ').filter(word => word !== '') logic.
		// We might need to adjust based on the generated solution.
		expect(screen.getByTestId('word-count')).toHaveTextContent(
			String(expected.word_count),
		);
		expect(screen.getByTestId('char-count')).toHaveTextContent(
			String(expected.char_count),
		);
		expect(screen.getByTestId('is-long')).toHaveTextContent(
			String(expected.is_long),
		);
	});

	it('should handle and display stats for a string exactly 50 characters long', async () => {
		// Added async
		const input =
			'This string is exactly fifty characters long right now'; // 50 chars
		const expected: TextStats = {
			word_count: 9,
			char_count: 50,
			is_long: false, // is_long is > 50
		};

		render(GeneratedComponent, { props: { text: input } });

		expect(screen.getByTestId('word-count')).toHaveTextContent(
			String(expected.word_count),
		);
		expect(screen.getByTestId('char-count')).toHaveTextContent(
			String(expected.char_count),
		);
		expect(screen.getByTestId('is-long')).toHaveTextContent(
			String(expected.is_long),
		);
	});

	it('should handle and display stats for a string exactly 51 characters long', async () => {
		// Added async
		const input =
			'This string is exactly fifty-one characters long now.'; // 51 chars
		const expected: TextStats = {
			word_count: 8,
			char_count: 51,
			is_long: true, // is_long is > 50
		};

		render(GeneratedComponent, { props: { text: input } });

		expect(screen.getByTestId('word-count')).toHaveTextContent(
			String(expected.word_count),
		);
		expect(screen.getByTestId('char-count')).toHaveTextContent(
			String(expected.char_count),
		);
		expect(screen.getByTestId('is-long')).toHaveTextContent(
			String(expected.is_long),
		);
	});
});
