import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StromcomContext } from '../StromcomProvider.jsx';
import { StromcomHome } from '../StromcomHome.jsx';

function renderWithLayer(layer, props) {
  return render(
    <StromcomContext.Provider value={layer}>
      <StromcomHome {...props} />
    </StromcomContext.Provider>,
  );
}

afterEach(() => cleanup());

describe('StromcomHome', () => {
  it('initializes the notification center once on mount with the container element', () => {
    const layer = { home: vi.fn() };
    const { container } = renderWithLayer(layer);

    expect(layer.home).toHaveBeenCalledTimes(1);
    expect(layer.home).toHaveBeenCalledWith(container.firstChild);
  });

  it('does not re-initialize on re-render', () => {
    const layer = { home: vi.fn() };
    const { rerender } = renderWithLayer(layer, { className: 'a' });

    rerender(
      <StromcomContext.Provider value={layer}>
        <StromcomHome className="b" />
      </StromcomContext.Provider>,
    );

    expect(layer.home).toHaveBeenCalledTimes(1);
  });

  it('passes className, style and data-* attributes through to the container div', () => {
    const layer = { home: vi.fn() };
    const { container } = renderWithLayer(layer, {
      className: 'my-home',
      style: { bottom: 24 },
      'data-testid': 'home',
    });

    const div = container.firstChild;
    expect(div.className).toBe('my-home');
    expect(div.style.bottom).toBe('24px');
    expect(div.getAttribute('data-testid')).toBe('home');
  });

  it('does not call home when there is no layer', () => {
    const { container } = render(<StromcomHome />);

    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });
});
