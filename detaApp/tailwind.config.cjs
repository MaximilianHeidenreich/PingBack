const config = {
    darkMode: "class",
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        extend: {
            colors: {
                "pb-white": {
                    500: "#F2F2F2"
                },
                "pb-blue": {
                    500: "#7535E1"//"#457cF6",
                },
                "pb-red": {
                    500: "#7535E1"//"#457cF6",
                }
                //"pbblue": "#457cF6",
                //"pb-yellow": "#FFAB2f"
            }
        },
        
    },

    plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")]
};

module.exports = config;
