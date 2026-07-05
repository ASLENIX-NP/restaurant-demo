/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                indigo: {
                    50: '#fff6f0',
                    100: '#ffeadd',
                    200: '#ffd3ba',
                    300: '#fdb48e',
                    400: '#fa8a54',
                    500: '#F37021',
                    600: '#e3580d',
                    700: '#bd410c',
                    800: '#963412',
                    900: '#792d13',
                    950: '#411407',
                },
                blue: {
                    50: '#fff6f0',
                    100: '#ffeadd',
                    200: '#ffd3ba',
                    300: '#fdb48e',
                    400: '#fa8a54',
                    500: '#F37021',
                    600: '#e3580d',
                    700: '#bd410c',
                    800: '#963412',
                    900: '#792d13',
                    950: '#411407',
                },
                slate: {
                    50: '#f5f8fa',
                    100: '#e7f0f6',
                    200: '#d0e1ec',
                    300: '#abcbe0',
                    400: '#7faecd',
                    500: '#5f90b6',
                    600: '#4a769d',
                    700: '#3d5f81',
                    800: '#334f6b',
                    900: '#2F4858',
                    950: '#1d2e3a',
                }
            }
        },
    },
    plugins: [],
}