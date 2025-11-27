// Polyfills for browser compatibility
if (typeof window !== 'undefined') {
  // Only run polyfills in browser environment
  if (typeof global === 'undefined') {
    window.global = window;
  }
  
  // Dynamic imports for client-side only
  if (typeof Buffer === 'undefined') {
    import('buffer').then(({ Buffer }) => {
      window.Buffer = Buffer;
      if (typeof global !== 'undefined') {
        global.Buffer = Buffer;
      }
    }).catch(() => {
      // Buffer not available, that's okay
    });
  }
  
  if (typeof process === 'undefined') {
    import('process/browser').then((processModule) => {
      window.process = processModule.default || processModule;
      if (typeof global !== 'undefined') {
        global.process = processModule.default || processModule;
      }
    }).catch(() => {
      // Process not available, that's okay
    });
  }
}
