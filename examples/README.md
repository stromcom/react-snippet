# Examples

Each file is a focused snippet for one common pattern. They're meant to be
read top-to-bottom and copy-pasted into your app, not run as standalone
projects.

| File                                                                     | What it shows                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [`01-basic-app.jsx`](./01-basic-app.jsx)                                 | Minimal setup — provider, conf, user, one thread, home       |
| [`02-nextjs-app-router/`](./02-nextjs-app-router)                        | Next.js 13+ App Router with server-side hashing              |
| [`03-multi-page-router.jsx`](./03-multi-page-router.jsx)                 | React Router — provider once at the root, thread per route   |
| [`04-anonymous-then-login.jsx`](./04-anonymous-then-login.jsx)           | Public site; user mounts only after login                    |
| [`05-conditional-thread.jsx`](./05-conditional-thread.jsx)               | Thread inside a modal / opens on demand                      |
| [`06-multiple-threads-per-page.jsx`](./06-multiple-threads-per-page.jsx) | Several threads on one page (per-row, per-section, parallel) |
| [`07-imperative-api.jsx`](./07-imperative-api.jsx)                       | `useStromcom()` for switch-user / logout                     |
| [`08-theme-switcher.jsx`](./08-theme-switcher.jsx)                       | Light/dark/system theme at runtime                           |
| [`09-staging-environment.jsx`](./09-staging-environment.jsx)             | Staging or custom loader URL                                 |
| [`10-php-backend-integration.md`](./10-php-backend-integration.md)       | End-to-end with a PHP backend providing hashes               |

## Pattern cheatsheet

- **Provider, Conf, User, Home** → render **once** at the app root.
- **Thread** → render **per resource** (per order, per ticket, per article…). You can have many on a page.
- **Hashing** → always on the server. Never put `codeHashSecret` in the client bundle.
- **Switching the active user** → unmount/remount `<StromcomUser>` (or call `sc.initUser` via `useStromcom()`).
- **Reusing a thread div for a different conversation** → not supported; pass a new React `key` to remount.
