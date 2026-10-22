const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addComponents }) {
  addComponents({
    '.card': {
      '@apply relative mb-6 rounded-2xl bg-theme-cardbg dark:bg-themedark-cardbg shadow-[0_18px_40px_-28px_rgba(16,40,36,0.45)] dark:shadow-[none]':
        {},

      '.card-header': {
        '@apply p-[25px] border-b border-theme-border dark:border-themedark-border': {},
        h5: {
          '@apply text-base font-semibold': {}
        }
      },
      '.card-body': {
        '@apply p-[25px]': {}
      },
      '.card-footer': {
        '@apply p-[25px] border-t border-theme-border dark:border-themedark-border': {}
      },
      '.card-link': {
        '@apply text-primary-500 mr-3 inline-block hover:text-theme-bodycolor dark:hover:text-themedark-bodycolor': {}
      }
    }
  });
});
