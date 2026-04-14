import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StromcomContext } from '../StromcomProvider.jsx';
import { StromcomThread } from '../StromcomThread.jsx';

function renderWithLayer(layer, props) {
  return render(
    <StromcomContext.Provider value={layer}>
      <StromcomThread {...props} />
    </StromcomContext.Provider>,
  );
}

afterEach(() => cleanup());

describe('StromcomThread', () => {
  it('initializes the thread once on mount with the container element', () => {
    const layer = { thread: vi.fn() };
    const { container } = renderWithLayer(layer, { code: 'hashed-thread-1' });

    expect(layer.thread).toHaveBeenCalledTimes(1);
    expect(layer.thread).toHaveBeenCalledWith(container.firstChild, { code: 'hashed-thread-1' });
  });

  it('includes optional props that are provided', () => {
    const layer = { thread: vi.fn() };
    renderWithLayer(layer, {
      code: 'hashed-thread-2',
      name: 'Order #42',
      url: 'https://example.com/orders/42',
      userHint: false,
    });

    expect(layer.thread).toHaveBeenCalledWith(expect.anything(), {
      code: 'hashed-thread-2',
      name: 'Order #42',
      url: 'https://example.com/orders/42',
      userHint: false,
    });
  });

  it('does not re-initialize when props change after mount', () => {
    const layer = { thread: vi.fn() };
    const { rerender } = renderWithLayer(layer, { code: 'hashed-thread-3', name: 'A' });

    rerender(
      <StromcomContext.Provider value={layer}>
        <StromcomThread code="hashed-thread-3" name="B" />
      </StromcomContext.Provider>,
    );

    expect(layer.thread).toHaveBeenCalledTimes(1);
  });

  it('passes className, style and data-* attributes through to the container div', () => {
    const layer = { thread: vi.fn() };
    const { container } = renderWithLayer(layer, {
      code: 'hashed-thread-4',
      className: 'my-thread',
      style: { height: 400 },
      'data-testid': 'thread-4',
    });

    const div = container.firstChild;
    expect(div.className).toBe('my-thread');
    expect(div.style.height).toBe('400px');
    expect(div.getAttribute('data-testid')).toBe('thread-4');
  });

  it('does not call thread and renders an (uninitialized) div when there is no layer', () => {
    const { container } = render(<StromcomThread code="hashed-thread-5" />);

    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });
});
