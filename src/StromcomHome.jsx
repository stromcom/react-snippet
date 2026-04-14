import { useEffect, useRef } from 'react';
import { useStromcom } from './StromcomProvider.jsx';

/**
 * Embeds the Stromcom notification center into the rendered div.
 * Initialized once on mount.
 *
 * @param {object} [props.className] - CSS class for the container div
 * @param {object} [props.style]     - Inline styles for the container div
 *
 * @example
 * <StromcomHome style={{ position: 'fixed', bottom: 24, right: 24 }} />
 */
export function StromcomHome({ className, style, ...rest }) {
  const sc = useStromcom();
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!sc || !containerRef.current || initializedRef.current) return;
    sc.home(containerRef.current);
    initializedRef.current = true;
  }, [sc]);

  return <div ref={containerRef} className={className} style={style} {...rest} />;
}
