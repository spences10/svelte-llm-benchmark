// src/routes/api/models/+server.ts
import { OPENROUTER_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';

/**
 * Handles GET requests to fetch the list of available models from OpenRouter.
 */
export async function GET() {
	if (!OPENROUTER_API_KEY) {
		return json(
			{
				error: 'OpenRouter API key is not configured.',
			},
			{
				status: 500,
			},
		);
	}

	try {
		const response = await fetch(OPENROUTER_MODELS_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENROUTER_API_KEY}`,
				// Optional: Add Referer and Title headers as per OpenRouter's suggestion
				'HTTP-Referer': 'http://localhost:5173', // Replace with your actual app URL if needed
				'X-Title': 'Svelte LLM Benchmark', // Replace with your app name if needed
			},
		});

		if (!response.ok) {
			const error_text = await response.text();
			console.error(
				`Error fetching models from OpenRouter: ${response.status} - ${error_text}`,
			);
			return json(
				{
					error: `Failed to fetch models from OpenRouter: ${response.statusText}`,
				},
				{
					status: response.status,
				},
			);
		}

		const data = await response.json();
		// Assuming the response structure has a 'data' array containing models
		// We might want to filter or transform this data before sending to the client
		// For now, send the raw data.data array
		return json(data.data);
	} catch (error) {
		console.error('Error fetching models from OpenRouter:', error);
		return json(
			{
				error: 'An error occurred while fetching models.',
			},
			{
				status: 500,
			},
		);
	}
}
