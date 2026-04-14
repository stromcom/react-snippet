# @stromcom/react-snippet

React integration for the [STROMCOM](https://www.stromcom.cz) chat widget. Loads the SDK, identifies users, and embeds threads as plain React components.

Plain JavaScript with hand-written TypeScript declarations — works in JS and TS projects, no transpilation surprises.

The matching backend helper is [`stromcom/php-snippet`](https://github.com/stromcom/php-snippet) — it hashes user/thread codes server-side (which you must do).

## Requirements

- React **17+**
- A pair of `clientKey` / `clientSecret` from the STROMCOM dashboard
- A backend that can hash codes (typically `stromcom/php-snippet`)

## Installation

```bash
npm install @stromcom/react-snippet
# or
pnpm add @stromcom/react-snippet
# or
yarn add @stromcom/react-snippet
```

## Quick start

Wrap your app in `<StromcomProvider>`. It injects the loader script once and exposes the `stromCom` API to children. Components below queue their calls synchronously, so you don't need to wait for the loader to be ready.

```jsx
import {
  StromcomProvider,
  StromcomConf,
  StromcomUser,
  StromcomThread,
  StromcomHome,
} from '@stromcom/react-snippet';

export default function App() {
  return (
    <StromcomProvider clientKey="your-client-key" clientSecret="your-bearer-token">
      <StromcomConf
        notificationElementPosition={4}
        onNotification={(count) => console.log('unread:', count)}
      />

      <StromcomUser code={user.stromcomHash} name={user.name} emailAddress={user.email} />

      <StromcomThread
        code={order.stromcomHash}
        name={`Order #${order.id}`}
        url={typeof window !== 'undefined' ? window.location.href : undefined}
        style={{ height: 500 }}
      />

      <StromcomHome style={{ position: 'fixed', bottom: 24, right: 24 }} />
    </StromcomProvider>
  );
}
```

## Mental model — what runs once vs. many times

This is the most common confusion, so it's worth being explicit.

| Component            | How many times in app                         | Where to put it                                        | Runs                                                      |
| -------------------- | --------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| `<StromcomProvider>` | **Exactly once**                              | Top of the tree (root layout / `_app.js` / `main.jsx`) | Injects the loader script                                 |
| `<StromcomConf>`     | **Exactly once**                              | Direct child of provider                               | Sends configuration                                       |
| `<StromcomUser>`     | **Exactly once** at a time (per current user) | Direct child of provider                               | Identifies the user; re-runs when props change            |
| `<StromcomThread>`   | **Many times** — one per conversation         | Anywhere inside provider                               | Renders one thread; **cannot** be re-initialized in place |
| `<StromcomHome>`     | **Once** typically                            | Anywhere inside provider                               | Renders the notification center                           |

Think of it this way: provider, conf, and user are **app-level singletons**. Threads are **per-resource** — one per order, ticket, article, document, room… whatever your unit of conversation is. You can render five threads on a single page and dozens across the app.

### What's app-level, what's per-resource

```
StromcomProvider           ← once
 ├─ StromcomConf           ← once (configuration)
 ├─ StromcomUser           ← once (current user)
 ├─ StromcomHome           ← once (notification UI)
 └─ ...routes...
     ├─ /orders/123  → StromcomThread code={hash('order-123')}
     ├─ /orders/456  → StromcomThread code={hash('order-456')}
     └─ /article/x   → StromcomThread code={hash('article-x')}
                       StromcomThread code={hash('article-x-internal')}
                       StromcomThread code={hash('article-x-customer')}
```

### Multi-page apps (React Router, Next.js, Remix)

**The provider stays mounted the whole time** — put it in your root layout. Routes come and go below it. Each route renders its own `<StromcomThread>` for whatever resource it's showing. The widget script loads only once for the whole session.

You do **not** need to re-mount the provider on navigation, and you do **not** need a separate provider per route. See [`examples/03-multi-page-router.jsx`](./examples/03-multi-page-router.jsx).

### Multiple threads on the same page

Just render `<StromcomThread>` multiple times with different `code`s. Each div hosts one independent conversation. Useful for:

- A page with internal-team and customer-facing threads side by side
- A list view (e.g. comments on each row)
- A document with section-level discussions

See [`examples/06-multiple-threads-per-page.jsx`](./examples/06-multiple-threads-per-page.jsx).

### Anonymous / public pages

`<StromcomUser>` is optional. Skip it when there's no logged-in user — threads work read/write according to the dashboard's anonymous policy. Re-mount it the moment a visitor logs in. See [`examples/04-anonymous-then-login.jsx`](./examples/04-anonymous-then-login.jsx).

## Hashing user & thread codes — IMPORTANT

`code` values for `StromcomUser` and `StromcomThread` should be **hard to guess**. Hashing must happen **on your backend** (the secret cannot live in the browser).

Use the matching PHP package [`stromcom/php-snippet`](https://github.com/stromcom/php-snippet) (or any HMAC-SHA256 + base-62 implementation) to hash IDs server-side, then pass the hash through your API to React:

```php
// Backend (PHP)
$client = SnippetClientFactory::create(
    clientKey:      'your-client-key',
    clientSecret:   'your-bearer-token',
    codeHashSecret: 'your-app-secret',
);

$hashedUserCode   = $client->hashCode('user-id-42');     // ~43 chars
$hashedThreadCode = $client->hashCode('order-12345');
```

```jsx
// Frontend (React)
<StromcomUser code={hashedUserCode} name="Jane" />
<StromcomThread code={hashedThreadCode} />
```

Never pass raw internal IDs from the client.

## API

### `<StromcomProvider>`

| Prop           | Type                                      | Required | Description                                                                                                          |
| -------------- | ----------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `clientKey`    | `string`                                  | ✅       | Project client key.                                                                                                  |
| `clientSecret` | `string`                                  | ✅       | Project bearer token.                                                                                                |
| `environment`  | `"production"` \| `"staging"` \| `string` |          | Default `"production"`. Pass any custom URL to point at a self-hosted loader.                                        |
| `dataLayer`    | `string`                                  |          | Default `"stromCom"`. The global JS variable name. Change it if `stromCom` collides with something else on the page. |

### `<StromcomUser>`

Identifies the logged-in user. Re-calls `initUser` whenever any prop changes. Renders nothing.

| Prop           | Type      | Required | Description                                             |
| -------------- | --------- | -------- | ------------------------------------------------------- |
| `code`         | `string`  | ✅       | Hashed user identifier. Max 100 chars, `[a-zA-Z0-9-_]`. |
| `name`         | `string`  |          | Display name.                                           |
| `emailAddress` | `string`  |          | Used for email notifications.                           |
| `readOnly`     | `boolean` |          | When `true`, user can read but not send messages.       |
| `avatarURL`    | `string`  |          | Full avatar URL.                                        |

### `<StromcomThread>`

Renders a `<div>` and embeds a thread into it. Initialized once on mount; threads cannot be re-initialized in place. To switch the thread shown by the same DOM node, change React's `key` so a fresh div is mounted.

Accepts `className`, `style`, and any `data-*` attributes.

| Prop       | Type      | Required | Description                                               |
| ---------- | --------- | -------- | --------------------------------------------------------- |
| `code`     | `string`  | ✅       | Hashed thread identifier. Max 100 chars, `[a-zA-Z0-9-_]`. |
| `name`     | `string`  |          | Display name shown in the thread header.                  |
| `url`      | `string`  |          | Canonical URL — appears as a link in the header.          |
| `userHint` | `boolean` |          | Enable @mention suggestions. Default `true`.              |

### `<StromcomHome>`

Renders a `<div>` and embeds the notification center into it.

| Prop        | Type     | Description                      |
| ----------- | -------- | -------------------------------- |
| `className` | `string` | CSS class for the container.     |
| `style`     | `object` | Inline styles for the container. |

### `<StromcomConf>`

Sends SDK configuration. Place once inside the provider, before threads.

Notable options:

| Prop                          | Type                                      | Description                                   |
| ----------------------------- | ----------------------------------------- | --------------------------------------------- |
| `notificationRenderer`        | `Function`                                | Custom notification rendering function.       |
| `onNotification`              | `Function`                                | Called when unread count changes.             |
| `pageCSSPath`                 | `string`                                  | CSS file URL injected into the widget iframe. |
| `notificationElementPosition` | `1\|2\|3\|4`                              | Icon position: 1=TL, 2=TR, 3=BR, 4=BL.        |
| `theme`                       | `"stromcom-light"\|"stromcom-dark"\|null` | Theme. `null` follows browser preference.     |

See [`src/StromcomConf.jsx`](./src/StromcomConf.jsx) for the full list.

### `useStromcom()` — escape hatch

Returns the global `stromCom` object directly. Use when you need to call something the components don't expose (e.g. switching the active user from a button click).

```jsx
import { useStromcom } from '@stromcom/react-snippet';

function SwitchUserButton() {
  const sc = useStromcom();
  return <button onClick={() => sc?.initUser({ code: 'newHashedCode' })}>Switch user</button>;
}
```

## Examples

The [`examples/`](./examples) folder has focused, copy-pasteable snippets for the common patterns:

| File                                                                              | Scenario                                           |
| --------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`01-basic-app.jsx`](./examples/01-basic-app.jsx)                                 | Minimal setup — provider + user + one thread       |
| [`02-nextjs-app-router/`](./examples/02-nextjs-app-router)                        | Next.js 13+ App Router with server-side hashing    |
| [`03-multi-page-router.jsx`](./examples/03-multi-page-router.jsx)                 | React Router — provider in root, thread per route  |
| [`04-anonymous-then-login.jsx`](./examples/04-anonymous-then-login.jsx)           | Public site, user mounts only after login          |
| [`05-conditional-thread.jsx`](./examples/05-conditional-thread.jsx)               | Thread inside a modal / opens on demand            |
| [`06-multiple-threads-per-page.jsx`](./examples/06-multiple-threads-per-page.jsx) | Several threads on one page (per-row, per-section) |
| [`07-imperative-api.jsx`](./examples/07-imperative-api.jsx)                       | `useStromcom()` for switch-user / logout flows     |
| [`08-theme-switcher.jsx`](./examples/08-theme-switcher.jsx)                       | Toggling between light/dark theme at runtime       |
| [`09-staging-environment.jsx`](./examples/09-staging-environment.jsx)             | Pointing at staging or a custom loader URL         |
| [`10-php-backend-integration.md`](./examples/10-php-backend-integration.md)       | End-to-end with PHP backend providing hashes       |

## SSR / Next.js

The provider is SSR-safe — it only touches `window` inside `useEffect`. The loader script is appended on the client. No special wrapping needed in Next.js, Remix, etc.

For the App Router, mount `<StromcomProvider>` in a Client Component placed inside your root layout. Server Components above it stay server-rendered. See [`examples/02-nextjs-app-router/`](./examples/02-nextjs-app-router).

## Troubleshooting

**The loader script never appears.** Check that `clientKey` and `clientSecret` are non-empty. The provider does nothing on the server.

**Thread is empty / blank div.** Verify the `code` prop. Make sure it's the hashed value coming from your backend, not the raw internal ID.

**Thread doesn't update when I change props.** By design — threads can't be re-initialized in place. Pass a different React `key` to force a remount.

**Two providers warn / double script.** Don't mount the provider twice. The provider deduplicates the `<script>` tag, but mounting two providers with different `clientKey`s is unsupported.

**Notification count never fires.** Make sure `<StromcomConf onNotification={...}>` is mounted as a child of the provider, and that `<StromcomUser>` runs (notifications are user-scoped).

## License

MIT
