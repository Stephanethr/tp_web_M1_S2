/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tous les fichiers dans votre dossier `src`
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#1e90ff", // Couleur principale personnalisée
          600: "#1a78d6",
        },
      },
    },
  },
  plugins: [],
};
