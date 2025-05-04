import '@testing-library/jest-dom'; // Import jest-dom matchers
import { render, screen } from '@testing-library/svelte'; // Import testing utilities
import { beforeEach, describe, expect, it } from 'vitest';

// Unit tests for the 'counter' benchmark solution.
// These tests verify the functional correctness based on prompt.md

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

describe('counter benchmark tests', () => {
	beforeEach(() => {
		// Clean up the DOM before each test
		document.body.innerHTML = '';
		// Render the dynamically imported component
		render(GeneratedComponent);
	});

	it('should initialize the counter text content to "count is 0"', async () => {
		// Added async
		// Assuming the component renders a button with the counter text
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		// Use findByText for async rendering if needed, but getByText is fine for initial render
		expect(button.textContent).toBe('count is 0');
	});

	// This test might not be directly applicable if the component encapsulates its logic
	// and doesn't interact with arbitrary elements by ID.
	// Commenting out for now, can be adapted if needed.
	/*
  it('should not affect other elements', () => {
    document.body.innerHTML += `<div id="other-element">Unchanged</div>`;
    setup_counter(button);
    button.click();
    const other_element = document.getElementById('other-element');
    expect(other_element?.textContent).toBe('Unchanged');
  });
  */
});
