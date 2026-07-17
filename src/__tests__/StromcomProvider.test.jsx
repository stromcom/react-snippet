import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StromcomProvider, useStromcom } from '../StromcomProvider.jsx';

function scriptFor(clientKey) {
  return document.querySelector(`script[data-ck="${clientKey}"][data-type="stromcom"]`);
}

afterEach(() => {
  cleanup();
  document.querySelectorAll('script[data-type="stromcom"]').forEach((el) => el.remove());
  delete window.stromCom;
  delete window.stromComDL;
  delete window.customLayer;
  delete window.customLayerDL;
});

describe('StromcomProvider', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <StromcomProvider clientKey="ck_1" clientSecret="cs_1">
        <div>hello</div>
      </StromcomProvider>,
    );
    expect(getByText('hello')).toBeInTheDocument();
  });

  it('injects a script tag with the expected dataset and default (production) src', () => {
    render(
      <StromcomProvider clientKey="ck_1" clientSecret="cs_1">
        <div />
      </StromcomProvider>,
    );

    const script = scriptFor('ck_1');
    expect(script).not.toBeNull();
    expect(script.dataset.l).toBe('stromCom');
    expect(script.dataset.dl).toBe('stromComDL');
    expect(script.dataset.cs).toBe('cs_1');
    expect(script.src).toBe('https://cdn.stromcom.cz/loader.js?ck_1');
  });

  it('points at the staging loader when environment="staging"', () => {
    render(
      <StromcomProvider clientKey="ck_2" clientSecret="cs_2" environment="staging">
        <div />
      </StromcomProvider>,
    );

    expect(scriptFor('ck_2').src).toBe('https://cdn.staging.stromcom.cz/loader.js?ck_2');
  });

  it('treats an unknown environment value as a custom loader URL', () => {
    render(
      <StromcomProvider
        clientKey="ck_3"
        clientSecret="cs_3"
        environment="https://loader.example.com/custom.js"
      >
        <div />
      </StromcomProvider>,
    );

    expect(scriptFor('ck_3').src).toBe('https://loader.example.com/custom.js?ck_3');
  });

  it('does not inject a second script for the same clientKey', () => {
    const { rerender } = render(
      <StromcomProvider clientKey="ck_4" clientSecret="cs_4">
        <div />
      </StromcomProvider>,
    );
    rerender(
      <StromcomProvider clientKey="ck_4" clientSecret="cs_4">
        <div>changed</div>
      </StromcomProvider>,
    );

    expect(document.querySelectorAll('script[data-ck="ck_4"]')).toHaveLength(1);
  });

  it('removes the script on unmount', () => {
    const { unmount } = render(
      <StromcomProvider clientKey="ck_5" clientSecret="cs_5">
        <div />
      </StromcomProvider>,
    );
    expect(scriptFor('ck_5')).not.toBeNull();

    unmount();

    expect(scriptFor('ck_5')).toBeNull();
  });

  it('sets data-lang when language is provided', () => {
    render(
      <StromcomProvider clientKey="ck_lang" clientSecret="cs_lang" language="cs">
        <div />
      </StromcomProvider>,
    );

    expect(scriptFor('ck_lang').dataset.lang).toBe('cs');
  });

  it('omits data-lang when language is not provided', () => {
    render(
      <StromcomProvider clientKey="ck_nolang" clientSecret="cs_nolang">
        <div />
      </StromcomProvider>,
    );

    expect(scriptFor('ck_nolang').dataset.lang).toBeUndefined();
  });

  it('respects a custom dataLayer name', () => {
    render(
      <StromcomProvider clientKey="ck_6" clientSecret="cs_6" dataLayer="customLayer">
        <div />
      </StromcomProvider>,
    );

    expect(window.customLayer).toBeDefined();
    expect(window.customLayerDL).toBeDefined();
    expect(scriptFor('ck_6').dataset.l).toBe('customLayer');
  });

  it('exposes a stub layer with the expected queueing methods via useStromcom', () => {
    let layer;
    function Probe() {
      layer = useStromcom();
      return null;
    }

    render(
      <StromcomProvider clientKey="ck_7" clientSecret="cs_7">
        <Probe />
      </StromcomProvider>,
    );

    expect(layer).toBeTruthy();
    expect(typeof layer.initUser).toBe('function');
    expect(typeof layer.thread).toBe('function');
    expect(typeof layer.conf).toBe('function');
    expect(typeof layer.home).toBe('function');
  });

  it('returns null from useStromcom outside of a provider', () => {
    let layer = 'not-set';
    function Probe() {
      layer = useStromcom();
      return null;
    }
    render(<Probe />);

    expect(layer).toBeNull();
  });
});
