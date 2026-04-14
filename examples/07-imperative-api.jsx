/**
 * 07 — Imperative API via useStromcom()
 *
 * The components cover the common cases. When you need to call the SDK
 * directly — switching the active user from a button, logging out, calling
 * a method that doesn't have a component yet — `useStromcom()` returns the
 * global `stromCom` object.
 *
 * It returns `null` on the server and on the very first synchronous render.
 * Always guard with `?.`.
 */

import { useStromcom } from '@stromcom/react-snippet';

export function SwitchAccountButton({ targetUser }) {
  const sc = useStromcom();

  return (
    <button
      onClick={() =>
        sc?.initUser({
          code: targetUser.stromcomHash,
          name: targetUser.name,
          emailAddress: targetUser.email,
        })
      }
    >
      Switch to {targetUser.name}
    </button>
  );
}

export function LogoutButton({ onAfterLogout }) {
  const sc = useStromcom();

  return (
    <button
      onClick={async () => {
        // Reset the user in the widget so notifications stop firing.
        sc?.initUser({ code: '' });
        await fetch('/logout', { method: 'POST' });
        onAfterLogout?.();
      }}
    >
      Log out
    </button>
  );
}
