'use client';

/**
 * Client island that owns the provider, conf, user, and home.
 * Everything app-level lives here — once, at the root.
 *
 * Below this, route segments render their own <StromcomThread>s for whatever
 * resource each route is about (see page.jsx for an example).
 */

import {
  StromcomProvider,
  StromcomConf,
  StromcomUser,
  StromcomHome,
} from '@stromcom/react-snippet';

export default function StromcomShell({ user, children }) {
  return (
    <StromcomProvider
      clientKey={process.env.NEXT_PUBLIC_STROMCOM_CLIENT_KEY}
      clientSecret={process.env.NEXT_PUBLIC_STROMCOM_CLIENT_SECRET}
    >
      <StromcomConf notificationElementPosition={3} theme={null} />

      {user && (
        <StromcomUser
          code={user.code}
          name={user.name}
          emailAddress={user.emailAddress}
          avatarURL={user.avatarURL}
        />
      )}

      {children}

      <StromcomHome />
    </StromcomProvider>
  );
}
