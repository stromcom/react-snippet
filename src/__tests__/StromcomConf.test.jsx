import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StromcomContext } from '../StromcomProvider.jsx';
import { StromcomConf } from '../StromcomConf.jsx';

function renderWithLayer(layer, props) {
  return render(
    <StromcomContext.Provider value={layer}>
      <StromcomConf {...props} />
    </StromcomContext.Provider>,
  );
}

afterEach(() => cleanup());

describe('StromcomConf', () => {
  it('sends only the options that are provided', () => {
    const layer = { conf: vi.fn() };
    renderWithLayer(layer, { notificationElementPosition: 4 });

    expect(layer.conf).toHaveBeenCalledTimes(1);
    expect(layer.conf).toHaveBeenCalledWith({ notificationElementPosition: 4 });
  });

  it('forwards function options as-is (no string-wrapping)', () => {
    const layer = { conf: vi.fn() };
    const onNotification = vi.fn();
    renderWithLayer(layer, { onNotification });

    expect(layer.conf).toHaveBeenCalledWith({ onNotification });
  });

  it('forwards entityResolve as-is (no string-wrapping)', () => {
    const layer = { conf: vi.fn() };
    const entityResolve = vi.fn();
    renderWithLayer(layer, { entityResolve });

    expect(layer.conf).toHaveBeenCalledWith({ entityResolve });
  });

  it('re-sends conf when an option changes', () => {
    const layer = { conf: vi.fn() };
    const { rerender } = renderWithLayer(layer, { theme: 'stromcom-light' });

    rerender(
      <StromcomContext.Provider value={layer}>
        <StromcomConf theme="stromcom-dark" />
      </StromcomContext.Provider>,
    );

    expect(layer.conf).toHaveBeenCalledTimes(2);
    expect(layer.conf).toHaveBeenLastCalledWith({ theme: 'stromcom-dark' });
  });

  it('does not call conf and renders nothing when there is no layer', () => {
    const { container } = render(<StromcomConf theme="stromcom-dark" />);

    expect(container.firstChild).toBeNull();
  });
});
