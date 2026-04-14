/**
 * 02 — Next.js: an order detail page (Server Component)
 *
 * The page resolves the order, hashes its code on the server, then hands it
 * to a small client wrapper that actually renders <StromcomThread>.
 */

import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/orders';
import { hashCode } from '@/lib/stromcom-server';
import OrderThread from './order-thread';

export default async function OrderPage({ params }) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  const threadCode = await hashCode(`order-${order.id}`);

  return (
    <main>
      <h1>Order #{order.id}</h1>
      <OrderThread code={threadCode} name={`Order #${order.id}`} />
    </main>
  );
}
