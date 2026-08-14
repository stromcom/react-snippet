import { createContext, useContext, useEffect } from 'react';

export const StromcomContext = createContext(null);

const LOADER_URLS = {
  production: 'https://cdn.stromcom.cz/loader.js',
  staging: 'https://cdn.staging.stromcom.cz/loader.js',
};

/**
 * Sets up the stromCom stub layer synchronously so that child components can
 * queue calls (initUser, thread, conf, home) before the async loader.js arrives.
 * Mirrors what the PHP snippet() method generates.
 */
function setupLayer(dataLayer) {
  if (typeof window === 'undefined') {
    return null;
  }

  if (window[dataLayer]?.__sc_ready) {
    return window[dataLayer];
  }

  const dl = dataLayer + 'DL';
  window[dl] = window[dl] || {};
  window[dataLayer] = window[dataLayer] || {};
  const layer = window[dataLayer];

  const stub = (method, dlKey, isArray) => {
    dlKey = dlKey || method;
    if (isArray) {
      window[dl][dlKey] = window[dl][dlKey] || [];
    }

    layer[method] = (...args) => {
      if (isArray) {
        window[dl][dlKey].push(args);
      } else {
        window[dl][dlKey] = args;
      }
    };
  };

  stub('initUser', 'user');
  stub('thread', 'threads', true);
  stub('conf');
  stub('home', 'home', true);

  layer.__sc_ready = true;
  return layer;
}

/**
 * Wraps the app and loads the Stromcom widget SDK.
 *
 * @param {object}  props
 * @param {string}  props.clientKey     - Client key from the Stromcom dashboard
 * @param {string}  props.clientSecret  - Bearer token from the Stromcom dashboard
 * @param {string}  [props.dataLayer]   - Global JS variable name (default: "stromCom")
 * @param {string}  [props.environment] - "production" | "staging" | full custom loader URL
 * @param {string}  [props.language]    - Initial UI language (e.g. "cs", "en", "sk"). Omit to auto-detect from the
 *                                        browser. Use StromcomConf's `language` prop to change it at runtime.
 * @param {React.ReactNode} props.children
 *
 * @example
 * <StromcomProvider clientKey="ck_xxx" clientSecret="cs_xxx">
 *   <App />
 * </StromcomProvider>
 */
export function StromcomProvider({
  clientKey,
  clientSecret,
  dataLayer = 'stromCom',
  environment = 'production',
  language,
  children,
}) {
  // Set up stubs synchronously so children can queue calls immediately on render.
  const layer = setupLayer(dataLayer);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Avoid injecting the script twice (React StrictMode, HMR, etc.)
    if (document.querySelector(`script[data-ck="${clientKey}"][data-type="stromcom"]`)) return;

    const base = LOADER_URLS[environment] ?? environment;
    const dl = dataLayer + 'DL';

    const script = document.createElement('script');
    script.async = true;
    script.dataset.type = 'stromcom';
    script.dataset.l = dataLayer;
    script.dataset.dl = dl;
    script.dataset.ck = clientKey;
    script.dataset.cs = clientSecret;
    if (language) script.dataset.lang = language;
    script.src = `${base}?${clientKey}`;
    document.head.appendChild(script);

    return () => script.remove();
  }, [clientKey, clientSecret, dataLayer, environment, language]);

  return <StromcomContext.Provider value={layer}>{children}</StromcomContext.Provider>;
}

export function useStromcom() {
  return useContext(StromcomContext);
}
