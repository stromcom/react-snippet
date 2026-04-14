# 10 — End-to-end with a PHP backend

This example shows the full path: PHP backend hashes codes, your API
returns them, React renders threads. It mirrors how
[`stromcom/php-snippet`](https://github.com/stromcom/php-snippet) is
designed to be used.

## Why server-side hashing?

The hashing secret (`codeHashSecret`) must never reach the browser. If a
visitor could compute hashes themselves, they could probe other users'
threads. So:

1. **Server** holds `clientSecret` and `codeHashSecret`.
2. **Server** hashes user IDs and resource IDs.
3. **Server** hands the hashes to React via your API or template bootstrap.
4. **React** renders `<StromcomUser>` / `<StromcomThread>` with the hashes.

`clientKey` and `clientSecret` (the public-facing pair) do go to the
browser — they're the credentials the loader needs to identify your
project. They're meant to be public-ish; the _hashing_ secret is the
sensitive one.

## Backend (PHP)

```php
<?php

use Stromcom\Snippet\SnippetClientFactory;

$client = SnippetClientFactory::create(
    clientKey:      $_ENV['STROMCOM_CLIENT_KEY'],
    clientSecret:   $_ENV['STROMCOM_CLIENT_SECRET'],
    codeHashSecret: $_ENV['STROMCOM_HASH_SECRET'],
);

// e.g. inside an API endpoint that returns the bootstrap payload for the page
header('Content-Type: application/json');
echo json_encode([
    'clientKey'    => $_ENV['STROMCOM_CLIENT_KEY'],
    'clientSecret' => $_ENV['STROMCOM_CLIENT_SECRET'],
    'user' => [
        'code'         => $client->hashCode("user-{$user->id}"),
        'name'         => $user->name,
        'emailAddress' => $user->email,
    ],
    'thread' => [
        'code' => $client->hashCode("order-{$order->id}"),
        'name' => "Order #{$order->id}",
    ],
]);
```

## Frontend (React)

Fetch the bootstrap payload, then mount the provider with the credentials
and the hashed codes you got back.

```jsx
import { useEffect, useState } from 'react';
import { StromcomProvider, StromcomUser, StromcomThread } from '@stromcom/react-snippet';

export default function OrderPage({ orderId }) {
  const [boot, setBoot] = useState(null);

  useEffect(() => {
    fetch(`/api/page-bootstrap?order=${orderId}`)
      .then((r) => r.json())
      .then(setBoot);
  }, [orderId]);

  if (!boot) return <p>Loading…</p>;

  return (
    <StromcomProvider clientKey={boot.clientKey} clientSecret={boot.clientSecret}>
      <StromcomUser
        code={boot.user.code}
        name={boot.user.name}
        emailAddress={boot.user.emailAddress}
      />
      <StromcomThread code={boot.thread.code} name={boot.thread.name} style={{ height: 500 }} />
    </StromcomProvider>
  );
}
```

## Tip — bootstrap via the HTML template

If your PHP renders the HTML shell (Symfony, Laravel Blade, plain PHP),
you can skip the round-trip and inject the bootstrap as JSON in the page:

```php
<script>
window.__STROMCOM__ = <?= json_encode($bootstrap, JSON_THROW_ON_ERROR) ?>;
</script>
<div id="root"></div>
```

```jsx
const boot = window.__STROMCOM__;
// …same as above
```

This makes the chat appear on first paint with no API round-trip.
