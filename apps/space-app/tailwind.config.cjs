const config = {
    darkMode: "class",
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/svhighlight/**/*.svelte"
    ],

    theme: {
        extend: {
            colors: {
                "viola": {
                    "50": "#f4eafb",
                    "100": "#e9d5f7",
                    "200": "#d3abf0",
                    "300": "#be82e8",
                    "400": "#a858e1",
                    "500": "#922ed9",
                    "600": "#7525ae",
                    "700": "#581c82",
                    "800": "#3a1257",
                    "900": "#1d092b"
                },
                "blub": {
                    "50": "#eceafb",
                    "100": "#d8d5f7",
                    "200": "#b1abf0",
                    "300": "#8b82e8",
                    "400": "#6458e1",
                    "500": "#3d2ed9",
                    "600": "#3125ae",
                    "700": "#251c82",
                    "800": "#181257",
                    "900": "#0c092b"
                },
                pink: {
                    50: "#fdf2f7",
                    100: "#fce7f2",
                    200: "#fbcfe5",
                    300: "#f8a9cf",
                    400: "#f26daa",
                    500: "#ea4a8f",
                    600: "#d9296c",
                    700: "#bc1a53",
                    800: "#9c1844",
                    900: "#82193c"
                },
                "pb-white": {
                    500: "#F2F2F2"
                },
                "pb-blue": {
                    500: "#7535E1" //"#457cF6",
                },
                "pb-red": {
                    500: "#7535E1" //"#457cF6",
                }
                //"pbblue": "#457cF6",
                //"pb-yellow": "#FFAB2f"
            }
        }
    },

    plugins: [require("@tailwindcss/forms")]
};

module.exports = config;
