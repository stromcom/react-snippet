/**
 * 02 — Next.js 13+ App Router: root layout
 *
 * Server Component. Reads the logged-in user from your auth lib, asks the
 * backend (PHP snippet client, your own API, …) to hash the user code, and
 * passes everything to the client provider below.
 *
 * The provider itself MUST be a Client Component because it mounts effects.
 * We keep it isolated in <StromcomShell> so the rest of the app can stay RSC.
 */

import { getCurrentUser } from '@/lib/auth';
import { hashCode } from '@/lib/stromcom-server'; // wraps stromcom/php-snippet or equivalent
import StromcomShell from './stromcom-shell';

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  // Hash on the server — secret stays in the server bundle.
  const stromcomUser = user
    ? {
        code: await hashCode(`user-${user.id}`),
        name: user.name,
        emailAddress: user.email,
        avatarURL: user.avatarURL,
      }
    : null;

  return (
    <html lang="en">
      <body>
        <StromcomShell user={stromcomUser}>{children}</StromcomShell>
      </body>
    </html>
  );
}
