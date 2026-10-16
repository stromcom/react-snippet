/**
 * 04 — Logged-out state, then login
 *
 * The widget renders nothing — no threads, no notification bubble — until
 * <StromcomUser> is mounted with both `code` and `name`. There are no
 * anonymous visitors: render the user (and your threads) only once someone
 * is logged in. As soon as they log in, mount <StromcomUser> and the widget
 * appears without a page reload.
 *
 * This is also the right pattern for "switch user" / "log out" flows:
 * unmount StromcomUser on logout, remount it on the next login.
 */

import {
  StromcomProvider,
  StromcomConf,
  StromcomUser,
  StromcomThread,
} from '@stromcom/react-snippet';
import { useAuth } from './auth'; // your auth context

export default function App() {
  const { user } = useAuth();

  return (
    <StromcomProvider
      clientKey={import.meta.env.VITE_STROMCOM_CLIENT_KEY}
      clientSecret={import.meta.env.VITE_STROMCOM_CLIENT_SECRET}
    >
      <StromcomConf notificationElementPosition={3} />
      {user ? (
        <>
          <StromcomUser code={user.stromcomHash} name={user.name} emailAddress={user.email} />
          <TeamThread />
        </>
      ) : (
        <p>Log in to see team conversations.</p>
      )}
    </StromcomProvider>
  );
}

function TeamThread() {
  // A shared thread for the logged-in team.
  // The hashed code comes from your /api/page-meta or similar.
  const { teamThreadHash } = window.__APP_BOOTSTRAP__;

  return <StromcomThread code={teamThreadHash} name="Team" style={{ height: 480 }} />;
}
