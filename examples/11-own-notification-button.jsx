/**
 * 11 — Notification center from your own button
 *
 * Instead of the default bubble, the notification center opens from a button
 * that is already part of your app. `notificationElementPosition` stays unset,
 * so the widget renders no bubble; the unread count comes from `onNotification`
 * and the button calls `toggleHome()` on the global `stromCom` object.
 *
 * The commands exist only once the widget is running — `onLoad` tells you when.
 * Counts arrive every `notificationInterval` seconds; `refreshNotifications()`
 * loads them right away when the user comes back to the tab.
 */

import { useCallback, useEffect, useState } from 'react';
import { StromcomConf, StromcomProvider, StromcomUser, useStromcom } from '@stromcom/react-snippet';

function MessagesButton({ ready, count }) {
  const sc = useStromcom();

  return (
    <button type="button" disabled={!ready} onClick={() => sc?.toggleHome?.()}>
      Messages {count > 0 && <span className="badge">{count}</span>}
    </button>
  );
}

// Fresh counts when the user comes back to the tab instead of waiting for the next check.
function useRefreshOnVisible(ready) {
  const sc = useStromcom();

  useEffect(() => {
    if (!ready) return undefined;
    const onVisible = () => {
      if (!document.hidden) sc?.refreshNotifications?.();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [ready, sc]);
}

function MessagesHeader({ ready, count }) {
  useRefreshOnVisible(ready);

  return (
    <header>
      <MessagesButton ready={ready} count={count} />
    </header>
  );
}

export default function App({ currentUser }) {
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);

  // Stable identities — a new function on every render would re-send the configuration.
  const onLoad = useCallback(() => setReady(true), []);
  const onNotification = useCallback(
    (counts) => setCount(counts.thread + counts.notification + counts.reaction),
    [],
  );

  return (
    <StromcomProvider clientKey="YOUR_CLIENT_KEY" clientSecret="YOUR_CLIENT_SECRET">
      <StromcomConf onLoad={onLoad} onNotification={onNotification} notificationInterval={60} />
      <StromcomUser code={currentUser.stromcomHash} name={currentUser.name} />

      <MessagesHeader ready={ready} count={count} />
    </StromcomProvider>
  );
}
