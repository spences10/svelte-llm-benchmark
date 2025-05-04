// src/lib/llm_clients/types.ts

export interface LLMClient {
	/**
	 * Generates code based on a given prompt and model.
	 * @param prompt The prompt content.
	 * @param model The name of the LLM model to use.
	 * @returns A promise resolving to the generated code string.
	 */
	generate_code(prompt: string, model: string): Promise<string>;

	// Add other potential methods like chat, embeddings, etc. if needed later
	// chat(messages: any[], model: string): Promise<string>;
	// get_embeddings(text: string): Promise<number[]>;
}
