/**
 * 11 — Notification center from your own button
 *
 * Instead of the default bubble, the notification center opens from a button
 * that is already part of your app. `notificationElementPosition` stays unset,
 * so the widget renders no bubble; the unread count comes from `onNotification`
 * and the button calls `toggleHome()` on the global `stromCom` object.
 *
 * The commands exist only once the widget is running — `onLoad` tells you when.
 */

import { useCallback, useState } from 'react';
import { StromcomConf, StromcomProvider, StromcomUser, useStromcom } from '@stromcom/react-snippet';

function MessagesButton({ ready, count }) {
  const sc = useStromcom();

  return (
    <button type="button" disabled={!ready} onClick={() => sc?.toggleHome?.()}>
      Messages {count > 0 && <span className="badge">{count}</span>}
    </button>
  );
}

export default function App({ currentUser }) {
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);

  // Stable identities — a new function on every render would re-send the configuration.
  const onLoad = useCallback(() => setReady(true), []);
  const onNotification = useCallback((counts) => setCount(counts.thread + counts.notification), []);

  return (
    <StromcomProvider clientKey="YOUR_CLIENT_KEY" clientSecret="YOUR_CLIENT_SECRET">
      <StromcomConf onLoad={onLoad} onNotification={onNotification} />
      <StromcomUser code={currentUser.stromcomHash} name={currentUser.name} />

      <header>
        <MessagesButton ready={ready} count={count} />
      </header>
    </StromcomProvider>
  );
}
