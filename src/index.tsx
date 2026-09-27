import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'primeicons/primeicons.css';
import "nprogress/nprogress.css";
import "toastr/build/toastr.min.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';

/** Compact buttons: PrimeReact Tailwind PT defaults to px-4 py-3 text-base. */
const compactTailwind = {
  ...Tailwind,
  button: {
    ...Tailwind.button,
    root: (options: any) => {
      const props = { ...options.props, size: options.props?.size ?? "small" };
      const rootPt = (Tailwind as any).button?.root;
      return typeof rootPt === "function" ? rootPt({ ...options, props }) : rootPt;
    },
    label: (options: any) => {
      const labelPt = (Tailwind as any).button?.label;
      const base = typeof labelPt === "function" ? labelPt(options) : labelPt;
      const className = String(base?.className ?? "")
        .replace(/\bflex-1\b/g, "flex-none")
        .replace(/\bfont-bold\b/g, "font-medium");
      return { ...(base ?? {}), className: className || "flex-none font-medium" };
    },
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt: compactTailwind }}>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
