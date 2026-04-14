/**
 * 01 — Basic single-page app
 *
 * The smallest useful setup: provider, identify the current user, render
 * one thread for the resource the page is about.
 *
 * Assumes your backend already gave you hashed codes via your auth/page API.
 * Hashing must happen server-side (see ../README.md).
 */

import {
  StromcomProvider,
  StromcomConf,
  StromcomUser,
  StromcomThread,
  StromcomHome,
} from '@stromcom/react-snippet';

const CLIENT_KEY = import.meta.env.VITE_STROMCOM_CLIENT_KEY;
const CLIENT_SECRET = import.meta.env.VITE_STROMCOM_CLIENT_SECRET;

export default function App({ user, order }) {
  return (
    <StromcomProvider clientKey={CLIENT_KEY} clientSecret={CLIENT_SECRET}>
      {/* App-level: configuration & current user — render once. */}
      <StromcomConf
        theme={null} // follow browser preference
        notificationElementPosition={3} // bottom-right
        onNotification={(count) => {
          document.title = count > 0 ? `(${count}) Inbox — Acme` : 'Acme';
        }}
      />

      <StromcomUser
        code={user.stromcomHash}
        name={user.name}
        emailAddress={user.email}
        avatarURL={user.avatar}
      />

      {/* Per-resource: one thread for the order this page shows. */}
      <main>
        <h1>Order #{order.id}</h1>
        <StromcomThread
          code={order.stromcomHash}
          name={`Order #${order.id}`}
          url={window.location.href}
          style={{ height: 500, border: '1px solid #ddd', borderRadius: 8 }}
        />
      </main>

      {/* Floating notification center — render once. */}
      <StromcomHome />
    </StromcomProvider>
  );
}
