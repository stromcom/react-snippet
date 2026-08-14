import { useEffect } from 'react';
import { useStromcom } from './StromcomProvider.jsx';

/**
 * Sends SDK configuration to the Stromcom widget.
 * Should be placed once inside <StromcomProvider>, before threads or the home component.
 * Re-sends conf whenever any option prop changes.
 *
 * Options that accept functions (notificationRenderer, onNotification, etc.) take
 * actual JS functions here — no need for the string-wrapping used in the PHP library.
 *
 * @param {object}   [props.notificationRenderer]           - Function(notification) for custom notification rendering
 * @param {object}   [props.onNotification]                 - Function(count) called when unread count changes
 * @param {string}   [props.pageCSSPath]                    - URL of CSS file injected into the widget iframe
 * @param {Function} [props.notificationElementTargetElement] - Function/Promise/Element returning the icon mount target
 * @param {boolean}  [props.notificationElementShowAlways]  - Show icon even with zero notifications
 * @param {number}   [props.notificationElementPosition]    - Icon position: 1=top-left 2=top-right 3=bottom-right 4=bottom-left
 * @param {object}   [props.notificationElementStyles]      - Inline styles object for the default notification button
 * @param {string}   [props.notificationElementCSSPath]     - CSS URL for the default notification renderer
 * @param {boolean}  [props.notificationElementNoShadowRoot]- Disable shadow-root for notifications
 * @param {Function} [props.homeBeforeRender]               - Callback before notification center opens
 * @param {Function} [props.notificationElementBeforeRender]- Callback before notification icon renders
 * @param {Function} [props.notificationElementAfterRender] - Callback after notification icon renders
 * @param {(string|null)} [props.language] - UI language. Any code is accepted; one without a translation falls
 *                                           back to English. null follows the browser. Overrides the `language`
 *                                           prop on StromcomProvider, which is only the initial value; this one
 *                                           can be changed at runtime.
 * @param {('stromcom-light'|'stromcom-dark'|null)} [props.theme] - Theme. null follows browser preference.
 * @param {Function} [props.entityResolve] - async ({type, id}) => detail; resolves business-entity detail for the message editor's chip hover-card
 *
 * @example
 * <StromcomConf
 *   notificationElementPosition={4}
 *   onNotification={(count) => setBadge(count)}
 * />
 */
export function StromcomConf({
  notificationRenderer,
  onNotification,
  pageCSSPath,
  notificationElementTargetElement,
  notificationElementShowAlways,
  notificationElementPosition,
  notificationElementStyles,
  notificationElementCSSPath,
  notificationElementNoShadowRoot,
  homeBeforeRender,
  notificationElementBeforeRender,
  notificationElementAfterRender,
  language,
  theme,
  entityResolve,
}) {
  const sc = useStromcom();

  useEffect(() => {
    if (!sc) return;

    const opts = {};

    if (notificationRenderer !== undefined) opts.notificationRenderer = notificationRenderer;
    if (onNotification !== undefined) opts.onNotification = onNotification;
    if (pageCSSPath !== undefined) opts.pageCSSPath = pageCSSPath;
    if (notificationElementTargetElement !== undefined)
      opts.notificationElementTargetElement = notificationElementTargetElement;
    if (notificationElementShowAlways !== undefined)
      opts.notificationElementShowAlways = notificationElementShowAlways;
    if (notificationElementPosition !== undefined)
      opts.notificationElementPosition = notificationElementPosition;
    if (notificationElementStyles !== undefined)
      opts.notificationElementStyles = notificationElementStyles;
    if (notificationElementCSSPath !== undefined)
      opts.notificationElementCSSPath = notificationElementCSSPath;
    if (notificationElementNoShadowRoot !== undefined)
      opts.notificationElementNoShadowRoot = notificationElementNoShadowRoot;
    if (homeBeforeRender !== undefined) opts.homeBeforeRender = homeBeforeRender;
    if (notificationElementBeforeRender !== undefined)
      opts.notificationElementBeforeRender = notificationElementBeforeRender;
    if (notificationElementAfterRender !== undefined)
      opts.notificationElementAfterRender = notificationElementAfterRender;
    if (language !== undefined) opts.language = language;
    if (theme !== undefined) opts.theme = theme;
    if (entityResolve !== undefined) opts.entityResolve = entityResolve;

    sc.conf(opts);
  }, [
    sc,
    notificationRenderer,
    onNotification,
    pageCSSPath,
    notificationElementTargetElement,
    notificationElementShowAlways,
    notificationElementPosition,
    notificationElementStyles,
    notificationElementCSSPath,
    notificationElementNoShadowRoot,
    homeBeforeRender,
    notificationElementBeforeRender,
    notificationElementAfterRender,
    language,
    theme,
    entityResolve,
  ]);

  return null;
}
