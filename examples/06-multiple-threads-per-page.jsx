/**
 * 06 — Multiple threads on the same page
 *
 * Three common shapes:
 *
 *  A) Two parallel threads on one resource (e.g. internal team + customer)
 *  B) A list view where every row has its own thread (e.g. comments per task)
 *  C) Section-level threads inside a long document
 *
 * Each <StromcomThread> is independent — different `code` => different
 * conversation. Render as many as you need.
 */

import { StromcomThread } from '@stromcom/react-snippet';

/* ---------- A) two threads, one resource ---------- */

export function TicketDetail({ ticket }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <section>
        <h3>Customer thread</h3>
        <StromcomThread
          code={ticket.customerThreadHash}
          name={`#${ticket.id} — customer`}
          style={{ height: 480 }}
        />
      </section>

      <section>
        <h3>Internal team</h3>
        <StromcomThread
          code={ticket.internalThreadHash}
          name={`#${ticket.id} — internal`}
          style={{ height: 480 }}
        />
      </section>
    </div>
  );
}

/* ---------- B) one thread per list row ---------- */

export function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
          <div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>

          <StromcomThread code={task.stromcomHash} name={task.title} style={{ height: 280 }} />
        </li>
      ))}
    </ul>
  );
}

/* ---------- C) section-level threads in a document ---------- */

export function Document({ doc }) {
  return (
    <article>
      <h1>{doc.title}</h1>
      {doc.sections.map((section) => (
        <section key={section.id}>
          <h2>{section.heading}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.html }} />

          <details>
            <summary>Discuss this section</summary>
            <StromcomThread
              code={section.stromcomHash}
              name={`${doc.title} — ${section.heading}`}
              style={{ height: 360 }}
            />
          </details>
        </section>
      ))}
    </article>
  );
}
