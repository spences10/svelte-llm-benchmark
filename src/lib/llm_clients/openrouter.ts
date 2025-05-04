import { OPENROUTER_API_KEY } from '$env/static/private';
import type { LLMClient } from './types';
const OPENROUTER_API_URL =
	'https://openrouter.ai/api/v1/chat/completions';

interface ChatCompletionParams {
	model: string;
	prompt: string;
	context?: string;
	max_tokens?: number;
	temperature?: number;
}

interface ChatCompletionResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: {
		index: number;
		message: {
			role: string;
			content: string;
		};
		finish_reason: string;
	}[];
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

/**
 * Generates Svelte code using the OpenRouter API.
 * @param params - The parameters for the chat completion request.
 * @returns The generated Svelte code as a string.
 * @throws If the API request fails or returns an unexpected response.
 */
export async function generate_svelte_code(
	params: ChatCompletionParams,
): Promise<string> {
	if (!OPENROUTER_API_KEY) {
		throw new Error(
			'OpenRouter API key is not configured. Set OPENROUTER_API_KEY in your .env file.',
		);
	}

	const {
		model,
		prompt,
		context = '',
		max_tokens = 1024,
		temperature = 0.1,
	} = params;

	const system_message = `You are an expert Svelte developer. Generate a Svelte 5 component based on the user's prompt. Output ONLY the Svelte code within a single markdown code block. Do not include any explanations or surrounding text.`;

	const user_prompt = context
		? `Context:\n\`\`\`\n${context}\n\`\`\`\n\nPrompt:\n${prompt}`
		: `Prompt:\n${prompt}`;

	try {
		const response = await fetch(OPENROUTER_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENROUTER_API_KEY}`,
				'HTTP-Referer': 'http://localhost:5173', // Replace with your actual app URL if needed
				'X-Title': 'Svelte LLM Benchmark', // Replace with your app name if needed
			},
			body: JSON.stringify({
				model: model,
				messages: [
					{ role: 'system', content: system_message },
					{ role: 'user', content: user_prompt },
				],
				max_tokens: max_tokens,
				temperature: temperature,
			}),
		});

		if (!response.ok) {
			const error_text = await response.text();
			throw new Error(
				`OpenRouter API request failed with status ${response.status}: ${error_text}`,
			);
		}

		const data: ChatCompletionResponse = await response.json();

		if (
			!data.choices ||
			data.choices.length === 0 ||
			!data.choices[0].message ||
			!data.choices[0].message.content
		) {
			throw new Error(
				'Invalid response structure from OpenRouter API',
			);
		}

		// Extract content within the first markdown code block
		const content = data.choices[0].message.content;
		const code_block_match = content.match(
			/```(?:svelte)?\s*([\s\S]*?)\s*```/,
		);

		if (!code_block_match || !code_block_match[1]) {
			// If no code block found, assume the entire content is the code (less ideal)
			console.warn(
				'Could not find Svelte code block in LLM response, returning raw content.',
			);
			return content.trim();
		}

		return code_block_match[1].trim();
	} catch (error) {
		console.error('Error calling OpenRouter API:', error);
		throw error; // Re-throw the error to be handled by the caller
	}
}

/**
 * OpenRouter LLM Client implementing the LLMClient interface.
 */
class OpenRouterClient implements LLMClient {
	/**
	 * Generates code based on a given prompt and model using the OpenRouter API.
	 * @param prompt The prompt content.
	 * @param model The name of the LLM model to use.
	 * @returns A promise resolving to the generated code string.
	 */
	async generate_code(
		prompt: string,
		model: string,
	): Promise<string> {
		// Use the existing generate_svelte_code function internally
		// Provide default values for other ChatCompletionParams
		const params: ChatCompletionParams = {
			model: model,
			prompt: prompt,
			context: '', // Default context
			max_tokens: 1024, // Default max_tokens
			temperature: 0.1, // Default temperature
		};
		return generate_svelte_code(params);
	}

	// If needed, add other methods from LLMClient interface here
	// async chat(messages: any[], model: string): Promise<string> {
	//   throw new Error('Chat method not implemented for OpenRouterClient');
	// }
}

// Export an instance of the client
export const openrouter_client = new OpenRouterClient();
