import '@testing-library/jest-dom';

// Node.js 25+ ships a built-in `localStorage` that is non-functional without
// --localstorage-file and shadows jsdom's Storage. Replace it with a proper
// in-memory implementation so tests can call getItem/setItem/clear freely.
(function patchLocalStorage() {
  let store: Record<string, string> = {};
  const mock: Storage = {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      store = {};
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key: string, value: string) {
      store[String(key)] = String(value);
    },
    removeItem(key: string) {
      delete store[key];
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
  };
  Object.defineProperty(globalThis, 'localStorage', {
    value: mock,
    writable: true,
    configurable: true,
  });
})();
