import '@testing-library/jest-dom/vitest';

// jsdom não implementa estas APIs de navegador; o código de produção as usa
// de forma defensiva e os testes precisam de um stub neutro.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  }
  window.scrollTo = (() => undefined) as typeof window.scrollTo;
}
