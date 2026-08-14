import type { CSSProperties, ReactNode } from 'react';

export type StromcomEnvironment = 'production' | 'staging' | (string & {});

export interface StromcomLayer {
  initUser: (options: StromcomUserOptions) => void;
  thread: (target: HTMLElement, options: StromcomThreadOptions) => void;
  conf: (options: StromcomConfOptions) => void;
  home: (target: HTMLElement) => void;
  [key: string]: any;
}

export interface StromcomProviderProps {
  /** Project client key from the Stromcom dashboard. */
  clientKey: string;
  /** Bearer token / client secret from the Stromcom dashboard. */
  clientSecret: string;
  /** Global JS variable name. Default `"stromCom"`. */
  dataLayer?: string;
  /** `"production"`, `"staging"`, or a full custom loader URL. Default `"production"`. */
  environment?: StromcomEnvironment;
  /**
   * Initial UI language (e.g. `"cs"`, `"en"`, `"sk"`). Any code is accepted; one without a
   * translation falls back to the browser language, then English. Omit to auto-detect from the browser.
   * Use `StromcomConf`'s `language` prop to change it at runtime.
   */
  language?: string;
  children?: ReactNode;
}

export function StromcomProvider(props: StromcomProviderProps): JSX.Element;

/** Returns the global stromCom object once the loader is set up (or `null` server-side). */
export function useStromcom(): StromcomLayer | null;

export interface StromcomUserOptions {
  /** Hashed unique user identifier (max 100 chars, [a-zA-Z0-9-_]). Hash server-side. */
  code: string;
  name?: string;
  emailAddress?: string;
  readOnly?: boolean;
  avatarURL?: string;
}

export function StromcomUser(props: StromcomUserOptions): null;

export interface StromcomThreadOptions {
  /** Hashed unique thread identifier (max 100 chars, [a-zA-Z0-9-_]). Hash server-side. */
  code: string;
  name?: string;
  url?: string;
  /** Enable @mention suggestions. Default `true`. */
  userHint?: boolean;
}

export interface StromcomThreadProps extends StromcomThreadOptions {
  className?: string;
  style?: CSSProperties;
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export function StromcomThread(props: StromcomThreadProps): JSX.Element;

export interface StromcomHomeProps {
  className?: string;
  style?: CSSProperties;
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export function StromcomHome(props: StromcomHomeProps): JSX.Element;

export interface StromcomConfOptions {
  notificationRenderer?: (notification: unknown) => unknown;
  onNotification?: (count: number) => void;
  pageCSSPath?: string;
  notificationElementTargetElement?:
    (() => HTMLElement | Promise<HTMLElement>) | HTMLElement | Promise<HTMLElement>;
  notificationElementShowAlways?: boolean;
  /** Icon position: 1=top-left, 2=top-right, 3=bottom-right, 4=bottom-left. */
  notificationElementPosition?: 1 | 2 | 3 | 4;
  notificationElementStyles?: Record<string, string | number | null>;
  notificationElementCSSPath?: string;
  notificationElementNoShadowRoot?: boolean;
  homeBeforeRender?: () => void | Promise<void>;
  notificationElementBeforeRender?: () => void | Promise<void>;
  notificationElementAfterRender?: () => void;
  /**
   * UI language, or `null` to follow the browser. Any language code is accepted;
   * one the widget has no translation for falls back to the browser language, then English.
   * Overrides `StromcomProviderProps.language`, which is only the initial value.
   */
  language?: string | null;
  /** Theme: `"stromcom-light"`, `"stromcom-dark"`, or `null` to follow browser preference. */
  theme?: 'stromcom-light' | 'stromcom-dark' | null;
  /** Resolves business-entity detail (order, ticket…) for the message editor's chip hover-card. */
  entityResolve?: (entity: { type: string; id: string }) => unknown | Promise<unknown>;
}

export function StromcomConf(props: StromcomConfOptions): null;
