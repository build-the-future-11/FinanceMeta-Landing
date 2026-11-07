import { defineConfig } from 'vite';

export default defineConfig({
  build: { manifest: true },
  // The managed development preview uses this host; other Vite host checks stay enabled.
  server: { allowedHosts: ['terminal.local'] },
});
