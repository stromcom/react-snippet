/**
 * 08 — Theme switching
 *
 * <StromcomConf> sends configuration to the SDK. Re-rendering it with a
 * different `theme` prop pushes the new theme to the widget.
 *
 * Pass `null` to follow the browser preference (prefers-color-scheme).
 */

import { useState } from 'react';
import { StromcomConf } from '@stromcom/react-snippet';

export function ThemedStromcom({ appTheme }) {
  // Map your app's theme state onto the widget's accepted values.
  const widgetTheme =
    appTheme === 'dark' ? 'stromcom-dark' : appTheme === 'light' ? 'stromcom-light' : null; // "system"

  return <StromcomConf theme={widgetTheme} notificationElementPosition={3} />;
}

export function ThemeToggleDemo() {
  const [theme, setTheme] = useState('system');

  return (
    <>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      {/* Mounted inside <StromcomProvider> elsewhere in your tree. */}
      <ThemedStromcom appTheme={theme} />
    </>
  );
}
