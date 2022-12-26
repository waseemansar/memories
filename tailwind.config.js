/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{ts,tsx,jsx,js}"],
    theme: {
        extend: {
            fontFamily: {
                Muli: ["Muli", "sans-serif"],
            },
            colors: {
                primary: "var(--primary-color)",
            },
        },
    },
    plugins: [require("@tailwindcss/line-clamp")],
};
