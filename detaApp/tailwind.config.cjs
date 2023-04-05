const config = {
    darkMode: "class",
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/svhighlight/**/*.svelte"
    ],

    theme: {
        extend: {
            colors: {
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

    plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")]
};

module.exports = config;
