import keyframes from './tailwind_plugins/keyframes.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ✅ React support
    "./node_modules/primereact/passthrough/tailwind/**/*.js",
  ],
  darkMode: ['class', '[data-pc-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: [
        '"Open Sans", sans-serif',
        {
          fontFeatureSettings: '"salt"'
        }
      ]
    },
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {
      fontSize: {
        sm: '0.75rem',
        base: '0.875rem',
        'f-h1': '48px',
        'f-h2': '44px',
        'f-h3': '26px',
        'f-h4': '20px',
        'f-h5': '18px',
        'f-h6': '14px'
      },
      spacing: {
        'sidebar-width': '264px',
        'header-height': '74px',
        'topbar-height': '60px',
        'sidebar-collapsed-width': '80px',
        'sidebar-collapsed-active-width': '300px',
        'sidebar-tab-width': '75px',
        'sidebar-tab-navbar-width': '320px'
      },
      boxShadow: {
        sidebarshadow: '1px 0 20px 0 #3f4d67',
        lightsidebarshadow: '7px 0 15px 0 rgba(69, 90, 100, 0.09)'
      },
      colors: {
        // Template tokens used by tailwind_plugins via @apply (e.g. text-theme-headings)
        'theme-headings': 'rgb(var(--theme-headings) / <alpha-value>)',
        'theme-bodycolor': 'rgb(var(--theme-bodycolor) / <alpha-value>)',
        'theme-secondarytextcolor': 'rgb(var(--theme-secondarytextcolor) / <alpha-value>)',
        'theme-bodybg': 'rgb(var(--theme-bodybg) / <alpha-value>)',
        'theme-cardbg': 'rgb(var(--theme-cardbg) / <alpha-value>)',
        'theme-border': 'rgb(var(--theme-border) / <alpha-value>)',
        'theme-inputborder': 'rgb(var(--theme-inputborder) / <alpha-value>)',
        'theme-inputbg': 'rgb(var(--theme-inputbg) / <alpha-value>)',
        'theme-sidebarbg': 'rgb(var(--theme-sidebarbg) / <alpha-value>)',
        'theme-sidebarcaption': 'rgb(var(--theme-sidebarcaption) / <alpha-value>)',
        'theme-sidebarcolor': 'rgb(var(--theme-sidebarcolor) / <alpha-value>)',
        'theme-lightsidebarbg': 'rgb(var(--theme-lightsidebarbg) / <alpha-value>)',
        'theme-lightsidebarcaption': 'rgb(var(--theme-lightsidebarcaption) / <alpha-value>)',
        'theme-lightsidebarcolor': 'rgb(var(--theme-lightsidebarcolor) / <alpha-value>)',
        'theme-headerbg': 'rgb(var(--theme-headerbg) / <alpha-value>)',
        'theme-headercolor': 'rgb(var(--theme-headercolor) / <alpha-value>)',
        'theme-activebg': 'rgb(var(--theme-activebg) / <alpha-value>)',

        'themedark-headings': 'rgb(var(--themedark-headings) / <alpha-value>)',
        'themedark-bodycolor': 'rgb(var(--themedark-bodycolor) / <alpha-value>)',
        'themedark-secondarytextcolor': 'rgb(var(--themedark-secondarytextcolor) / <alpha-value>)',
        'themedark-bodybg': 'rgb(var(--themedark-bodybg) / <alpha-value>)',
        'themedark-cardbg': 'rgb(var(--themedark-cardbg) / <alpha-value>)',
        'themedark-border': 'rgb(var(--themedark-border) / <alpha-value>)',
        'themedark-inputborder': 'rgb(var(--themedark-inputborder) / <alpha-value>)',
        'themedark-inputbg': 'rgb(var(--themedark-inputbg) / <alpha-value>)',
        'themedark-sidebarbg': 'rgb(var(--themedark-sidebarbg) / <alpha-value>)',
        'themedark-sidebarcaption': 'rgb(var(--themedark-sidebarcaption) / <alpha-value>)',
        'themedark-sidebarcolor': 'rgb(var(--themedark-sidebarcolor) / <alpha-value>)',
        'themedark-headerbg': 'rgb(var(--themedark-headerbg) / <alpha-value>)',
        'themedark-headercolor': 'rgb(var(--themedark-headercolor) / <alpha-value>)',
        'themedark-activebg': 'rgb(var(--themedark-activebg) / <alpha-value>)',

        // Minimal semantic palette referenced by plugins
        primary: {
          50: '#e8f1ff',
          500: '#1677ff',
          600: '#0f62fe',
          700: '#0043ce'
        },
        secondary: {
          DEFAULT: '#6c757d',
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          500: '#6c757d',
          600: '#5c636a'
        },
        success: {
          500: '#2fb344'
        },
        danger: {
          500: '#d63939'
        },
        dark: {
          500: 'rgba(0,0,0,0.5)'
        }
      },
      backgroundImage: {
        // ✅ KEEP AS IS
      },
      keyframes: keyframes,
    }
  },
  plugins: [
    require('./tailwind_plugins/layouts/header.js'),
    require('./tailwind_plugins/layouts/sidebar.js'),
    require('./tailwind_plugins/layouts/common.js'),
    require('./tailwind_plugins/badge.js'),
    require('./tailwind_plugins/buttons.js'),
    require('./tailwind_plugins/breadcrumb.js'),
    require('./tailwind_plugins/card.js'),
    require('./tailwind_plugins/dropdown.js'),
    require('./tailwind_plugins/forms.js'),
    require('./tailwind_plugins/offcanvas.js'),
    require('./tailwind_plugins/simplebar.js'),
    require('./tailwind_plugins/table.js'),
    require('./tailwind_plugins/typography.js')
  ]
};