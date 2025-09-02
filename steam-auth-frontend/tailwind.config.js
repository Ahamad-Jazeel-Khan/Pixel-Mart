// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ important
  ],
  theme: {
    extend: {colors: {
        toast: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          default: '#3B82F6',
        }
      }},
  },
  plugins: [],
}
