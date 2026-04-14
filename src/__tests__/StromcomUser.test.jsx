import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StromcomContext } from '../StromcomProvider.jsx';
import { StromcomUser } from '../StromcomUser.jsx';

function renderWithLayer(layer, props) {
  return render(
    <StromcomContext.Provider value={layer}>
      <StromcomUser {...props} />
    </StromcomContext.Provider>,
  );
}

afterEach(() => cleanup());

describe('StromcomUser', () => {
  it('calls initUser with only the code when no optional props are given', () => {
    const layer = { initUser: vi.fn() };
    renderWithLayer(layer, { code: 'hashed-user-1' });

    expect(layer.initUser).toHaveBeenCalledTimes(1);
    expect(layer.initUser).toHaveBeenCalledWith({ code: 'hashed-user-1' });
  });

  it('includes optional props that are provided', () => {
    const layer = { initUser: vi.fn() };
    renderWithLayer(layer, {
      code: 'hashed-user-2',
      name: 'Jane',
      emailAddress: 'jane@example.com',
      readOnly: true,
      avatarURL: 'https://example.com/avatar.png',
    });

    expect(layer.initUser).toHaveBeenCalledWith({
      code: 'hashed-user-2',
      name: 'Jane',
      emailAddress: 'jane@example.com',
      readOnly: true,
      avatarURL: 'https://example.com/avatar.png',
    });
  });

  it('re-calls initUser when a prop changes', () => {
    const layer = { initUser: vi.fn() };
    const { rerender } = renderWithLayer(layer, { code: 'hashed-user-3', name: 'Jane' });

    rerender(
      <StromcomContext.Provider value={layer}>
        <StromcomUser code="hashed-user-3" name="Janet" />
      </StromcomContext.Provider>,
    );

    expect(layer.initUser).toHaveBeenCalledTimes(2);
    expect(layer.initUser).toHaveBeenLastCalledWith({ code: 'hashed-user-3', name: 'Janet' });
  });

  it('does not call initUser and renders nothing when there is no layer', () => {
    const { container } = render(<StromcomUser code="hashed-user-4" />);

    expect(container.firstChild).toBeNull();
  });
});
