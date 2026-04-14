/**
 * 09 — Staging or custom loader URL
 *
 * The provider's `environment` prop accepts:
 *   - "production" (default) — https://cdn.stromcom.cz/loader.js
 *   - "staging"             — https://cdn.staging.stromcom.cz/loader.js
 *   - any full URL          — point at a self-hosted / branch-preview loader
 */

import { StromcomProvider } from '@stromcom/react-snippet';

export function ProductionApp({ children }) {
  return (
    <StromcomProvider
      clientKey={process.env.REACT_APP_STROMCOM_CLIENT_KEY}
      clientSecret={process.env.REACT_APP_STROMCOM_CLIENT_SECRET}
      environment="production"
    >
      {children}
    </StromcomProvider>
  );
}

export function StagingApp({ children }) {
  return (
    <StromcomProvider
      clientKey={process.env.REACT_APP_STROMCOM_CLIENT_KEY}
      clientSecret={process.env.REACT_APP_STROMCOM_CLIENT_SECRET}
      environment="staging"
    >
      {children}
    </StromcomProvider>
  );
}

/** Pick at runtime — useful when one bundle serves multiple environments. */
export function EnvAwareApp({ children }) {
  const env =
    typeof window !== 'undefined' && window.location.hostname.endsWith('.staging.example.com')
      ? 'staging'
      : 'production';

  return (
    <StromcomProvider
      clientKey={process.env.REACT_APP_STROMCOM_CLIENT_KEY}
      clientSecret={process.env.REACT_APP_STROMCOM_CLIENT_SECRET}
      environment={env}
    >
      {children}
    </StromcomProvider>
  );
}

/** Custom loader URL — e.g. a branch deploy or a self-hosted loader. */
export function CustomLoaderApp({ children }) {
  return (
    <StromcomProvider
      clientKey={process.env.REACT_APP_STROMCOM_CLIENT_KEY}
      clientSecret={process.env.REACT_APP_STROMCOM_CLIENT_SECRET}
      environment="https://cdn.preview.stromcom.cz/branch-42/loader.js"
    >
      {children}
    </StromcomProvider>
  );
}
