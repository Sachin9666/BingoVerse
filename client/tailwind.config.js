export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 30px rgba(56, 189, 248, 0.25)',
      },
      backgroundImage: {
        'neon-gradient': 'radial-gradient(circle at top, rgba(56,189,248,0.2), transparent 30%), radial-gradient(circle at 70% 80%, rgba(168,85,247,0.18), transparent 25%), linear-gradient(135deg, #020617 0%, #080a16 100%)'
      }
    }
  },
  plugins: []
};
