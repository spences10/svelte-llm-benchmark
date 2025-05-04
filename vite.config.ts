import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					// Include both Svelte component tests and humaneval tests
					include: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/humaneval/**/*.test.ts'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts'],
				},
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					// Exclude Svelte component tests AND humaneval tests from server environment
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/humaneval/**/*.test.ts'],
				},
			},
		],
	},
});
