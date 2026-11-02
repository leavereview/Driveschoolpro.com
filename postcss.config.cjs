// Tailwind 3 through PostCSS. Replaces @astrojs/tailwind, whose peer range stops at Astro 5
// (Astro 7 upgrade, Driveschoolpro.com#44). global.css already holds the @tailwind directives.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
