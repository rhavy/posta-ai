/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // cobre tudo dentro de src/
    "./app/**/*.{js,ts,jsx,tsx}", // se estiver usando pasta app/
    "./pages/**/*.{js,ts,jsx,tsx}", // se estiver usando pasta pages/
    "./components/**/*.{js,ts,jsx,tsx}", // componentes fora de src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}