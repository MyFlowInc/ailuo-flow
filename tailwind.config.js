/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {}
	},
	// prefix: 'tw-',
	important: true,
	plugins: [],
	corePlugins: {
		preflight: false
	}
};
