/**
 * 04 — Public site, then login
 *
 * <StromcomUser> is optional. While the visitor is anonymous, simply don't
 * render it. As soon as they log in, mount it with the hashed user code —
 * any threads already on the page will start associating new messages with
 * that user without a page reload.
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
  return (
    <StromcomProvider
      clientKey={import.meta.env.VITE_STROMCOM_CLIENT_KEY}
      clientSecret={import.meta.env.VITE_STROMCOM_CLIENT_SECRET}
    >
      <StromcomConf notificationElementPosition={3} />
      <CurrentUserBinding />
      <PublicHelpThread />
    </StromcomProvider>
  );
}

function CurrentUserBinding() {
  const { user } = useAuth();

  // Anonymous visitor — render nothing. Threads still work according to
  // your dashboard's anonymous policy.
  if (!user) return null;

  return <StromcomUser code={user.stromcomHash} name={user.name} emailAddress={user.email} />;
}

function PublicHelpThread() {
  // A single shared "ask us anything" thread on the public site.
  // The hashed code comes from your /api/page-meta or similar.
  const { publicHelpHash } = window.__APP_BOOTSTRAP__;

  return <StromcomThread code={publicHelpHash} name="Talk to support" style={{ height: 480 }} />;
}
