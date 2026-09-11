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

  it('sends a single CSS path', () => {
    const layer = { conf: vi.fn() };
    renderWithLayer(layer, { appFrameCSSPath: 'https://example.com/frame.css' });

    expect(layer.conf).toHaveBeenCalledWith({ appFrameCSSPath: 'https://example.com/frame.css' });
  });

  it('sends a list of CSS paths as an array', () => {
    const layer = { conf: vi.fn() };
    const appCSSPath = ['https://example.com/a.css', 'https://example.com/b.css'];
    renderWithLayer(layer, { appCSSPath });

    expect(layer.conf).toHaveBeenCalledWith({ appCSSPath });
  });

  it('sends the language option', () => {
    const layer = { conf: vi.fn() };
    renderWithLayer(layer, { language: 'cs' });

    expect(layer.conf).toHaveBeenCalledWith({ language: 'cs' });
  });

  it('sends language null to follow the browser', () => {
    const layer = { conf: vi.fn() };
    renderWithLayer(layer, { language: null });

    expect(layer.conf).toHaveBeenCalledWith({ language: null });
  });

  it('re-sends conf when the language changes', () => {
    const layer = { conf: vi.fn() };
    const { rerender } = renderWithLayer(layer, { language: 'cs' });

    rerender(
      <StromcomContext.Provider value={layer}>
        <StromcomConf language="sk" />
      </StromcomContext.Provider>,
    );

    expect(layer.conf).toHaveBeenCalledTimes(2);
    expect(layer.conf).toHaveBeenLastCalledWith({ language: 'sk' });
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
