import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px",
        xsm: "400px",
      },
      fontSize: {
        base: ["16px", "28px"],
        h1: ["60px", "72px"],
        h2: ["52px", "62px"],
        h3: ["40px", "50px"],
        mh1: ["34px", "38px"],
        mh2: ["32px", "40px"],
        h4: ["28px", "36px"],
        h5: ["20px", "30px"],
        s1: ["16px", "26px"],
        s2: ["14px", "22px"],
        s3: ["16px", "24px"],
        xs: ["12px", "20px"],
        sm: ["14px", "24px"],
        sm1: ["14px", "28px"],
        lg: ["20px", "32px"],
        md: ["18px", "30px"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#000000",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;
