import { useEffect, useRef } from 'react';
import { useStromcom } from './StromcomProvider.jsx';

/**
 * Embeds a Stromcom conversation thread into the rendered div.
 * The thread is initialized once on mount.
 *
 * IMPORTANT: The `code` should already be hashed server-side (HMAC + base-62).
 *
 * @param {object}  props
 * @param {string}  props.code        - Hashed unique thread identifier (max 100 chars, [a-zA-Z0-9-_])
 * @param {string}  [props.name]      - Display name shown in the thread header
 * @param {string}  [props.url]       - Canonical URL of the page (shown as link in header)
 * @param {boolean} [props.userHint]  - Enable @mention suggestions (default: true)
 * @param {string}  [props.className] - CSS class for the container div
 * @param {object}  [props.style]     - Inline styles for the container div
 *
 * @example
 * <StromcomThread
 *   code={order.stromcomHash}
 *   name={`Order #${order.id}`}
 *   url={window.location.href}
 *   style={{ height: '400px' }}
 * />
 */
export function StromcomThread({ code, name, url, userHint, className, style, ...rest }) {
  const sc = useStromcom();
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!sc || !containerRef.current || initializedRef.current) return;

    const opts = { code };
    if (name !== undefined) opts.name = name;
    if (url !== undefined) opts.url = url;
    if (userHint !== undefined) opts.userHint = userHint;

    sc.thread(containerRef.current, opts);
    initializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally omit option deps, thread cannot be re-initialized
  }, [sc]);

  return <div ref={containerRef} className={className} style={style} {...rest} />;
}
