import { useEffect } from 'react';
import { useStromcom } from './StromcomProvider.jsx';

/**
 * Identifies the currently logged-in user.
 * Re-calls initUser whenever any prop changes.
 *
 * IMPORTANT: The `code` should already be hashed server-side (HMAC + base-62).
 * Never pass your raw internal user ID directly from the client.
 *
 * @param {object}  props
 * @param {string}  props.code          - Hashed unique user identifier (max 100 chars, [a-zA-Z0-9-_])
 * @param {string}  [props.name]        - Display name
 * @param {string}  [props.emailAddress]- Used for email notifications
 * @param {boolean} [props.readOnly]    - When true, user can read but not send messages
 * @param {string}  [props.avatarURL]   - Full URL to avatar image
 *
 * @example
 * <StromcomUser
 *   code={user.stromcomHash}
 *   name={user.name}
 *   emailAddress={user.email}
 * />
 */
export function StromcomUser({ code, name, emailAddress, readOnly, avatarURL }) {
  const sc = useStromcom();

  useEffect(() => {
    if (!sc) return;

    const opts = { code };
    if (name !== undefined) opts.name = name;
    if (emailAddress !== undefined) opts.emailAddress = emailAddress;
    if (readOnly !== undefined) opts.readOnly = readOnly;
    if (avatarURL !== undefined) opts.avatarURL = avatarURL;

    sc.initUser(opts);
  }, [sc, code, name, emailAddress, readOnly, avatarURL]);

  return null;
}
