export function setup_counter(element: HTMLButtonElement): void {
	let counter = 0;

	const setCounterText = (count: number) => {
		element.textContent = `count is ${count}`;
	};

	element.addEventListener('click', () => {
		counter++;
		setCounterText(counter);
	});

	setCounterText(0); // Set initial text content
}
