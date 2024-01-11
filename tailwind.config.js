/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        matterLight: ["Matter-Light", "sans"],
        matterRegular: ["Matter-Regular", "sans"],
        matterBold: ["Matter-Bold", "sans"],
        matterMedium: ["Matter-Medium", "sans"],
        matterBlack: ["Matter-Black", "sans"],
      },
    },
  },
  plugins: [],
};
