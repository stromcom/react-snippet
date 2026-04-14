/**
 * 05 — Thread inside a modal / opens on demand
 *
 * Threads initialize when their <div> mounts. Putting <StromcomThread>
 * behind an `if (open)` is the natural way to lazy-render it: the SDK call
 * is deferred until the modal is opened, and on close the div unmounts
 * cleanly. Reopening renders a fresh container — the SDK reconnects to the
 * same conversation by `code`.
 *
 * Same idea for tabs, accordions, drawers, popovers.
 */

import { useState } from 'react';
import { StromcomThread } from '@stromcom/react-snippet';

export function HelpButton({ pageHash, pageTitle }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Need help?</button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <h2>{pageTitle}</h2>
              <button onClick={() => setOpen(false)}>×</button>
            </header>
            <StromcomThread
              code={pageHash}
              name={pageTitle}
              url={window.location.href}
              style={{ height: 500 }}
            />
          </div>
        </div>
      )}
    </>
  );
}
