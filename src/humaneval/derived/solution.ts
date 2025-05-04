export interface TextStats {
	word_count: number;
	char_count: number;
	is_long: boolean;
}

export function calculate_text_stats(text: string): TextStats {
	const char_count: number = text.length;

	const trimmedText: string = text.trim();
	let word_count: number = 0;

	if (trimmedText) {
		// Split by one or more whitespace characters
		const words = trimmedText.split(/\s+/);
		word_count = words.length;
	}

	const is_long: boolean = char_count > 50;

	return {
		word_count,
		char_count,
		is_long,
	};
}
