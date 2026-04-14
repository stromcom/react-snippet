'use client';

import { StromcomThread } from '@stromcom/react-snippet';

export default function OrderThread({ code, name }) {
  return (
    <StromcomThread
      code={code}
      name={name}
      url={typeof window !== 'undefined' ? window.location.href : undefined}
      style={{ height: 600, border: '1px solid #e5e5e5', borderRadius: 8 }}
    />
  );
}
