/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#6B21A8',
          background: '#ffffff',
        },
      },
    },
    plugins: [require('daisyui')],
    daisyui: {
      themes: [
        {
          booksphere: {
            ...require('daisyui/src/colors/themes')['[data-theme=light]'],
            primary: '#6B21A8',
            'primary-content': '#ffffff',
            'base-100': '#ffffff',
          },
        },
      ],
    },
  };
  