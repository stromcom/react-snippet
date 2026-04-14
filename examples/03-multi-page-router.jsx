/**
 * 03 — Multi-page SPA with React Router
 *
 * The provider is mounted ONCE at the root, above the router. Routes mount
 * and unmount as the user navigates; the loader script does not reload, the
 * user identification does not flicker, and unread notifications keep
 * working across navigation.
 *
 * Each route renders its own <StromcomThread> for whichever resource it's
 * about. Threads are scoped to their route — when the user navigates away,
 * the thread div unmounts; when they come back, a fresh one is rendered
 * (the SDK reuses the existing conversation by `code`).
 */

import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import {
  StromcomProvider,
  StromcomConf,
  StromcomUser,
  StromcomThread,
  StromcomHome,
} from '@stromcom/react-snippet';
import { useCurrentUser, useOrder, useTicket } from './hooks'; // your data layer

const KEY = import.meta.env.VITE_STROMCOM_CLIENT_KEY;
const SECRET = import.meta.env.VITE_STROMCOM_CLIENT_SECRET;

export default function Root() {
  return (
    <BrowserRouter>
      <StromcomProvider clientKey={KEY} clientSecret={SECRET}>
        {/* App-level singletons — outside <Routes> on purpose. */}
        <AppLevelStromcom />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders/:id" element={<OrderPage />} />
          <Route path="/tickets/:id" element={<TicketPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
        </Routes>

        {/* Notification widget — also app-level. */}
        <StromcomHome />
      </StromcomProvider>
    </BrowserRouter>
  );
}

function AppLevelStromcom() {
  const user = useCurrentUser();
  return (
    <>
      <StromcomConf notificationElementPosition={3} />
      {user && <StromcomUser code={user.stromcomHash} name={user.name} emailAddress={user.email} />}
    </>
  );
}

/* -------- per-route threads -------- */

function OrderPage() {
  const { id } = useParams();
  const order = useOrder(id);
  if (!order) return <p>Loading…</p>;

  return (
    <article>
      <h1>Order #{order.id}</h1>
      <StromcomThread
        code={order.stromcomHash}
        name={`Order #${order.id}`}
        url={window.location.href}
        style={{ height: 500 }}
      />
    </article>
  );
}

function TicketPage() {
  const { id } = useParams();
  const ticket = useTicket(id);
  if (!ticket) return <p>Loading…</p>;

  return (
    <article>
      <h1>{ticket.subject}</h1>
      <StromcomThread code={ticket.stromcomHash} name={ticket.subject} style={{ height: 500 }} />
    </article>
  );
}

function ArticlePage() {
  // No thread on this route — that's fine. Users still see the global
  // notification UI from <StromcomHome /> at the root.
  return <article>… article content …</article>;
}

function HomePage() {
  return <h1>Welcome</h1>;
}
