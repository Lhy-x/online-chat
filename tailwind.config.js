/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./node_modules/flowbite/**/*.js",
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
],
  theme: {
     colors: {
        'matBlack': '#28282B',
      },
    extend: {
   
    },
  },
  plugins: [
    require('flowbite/plugin')
]
}

