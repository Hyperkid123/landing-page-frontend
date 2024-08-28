import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';
// import { viteStaticCopy } from 'vite-plugin-static-copy';

const MFPlugin = federation({
  // base: 'http://localhost:5173',
  name: 'landing',
  filename: 'landing-entry.js',
  // Modules to expose
  exposes: {
    './RootApp': path.resolve(__dirname, './src/moduleEntries/AppEntry.tsx'),
    './PdfEntry': path.resolve(__dirname, './src/moduleEntries/PdfEntry.tsx'),
    './RecentlyVisited': path.resolve(
      __dirname,
      'src/components/widgets/recently-visited.tsx'
    ),
    './ExploreCapabilities': path.resolve(
      __dirname,
      'src/components/widgets/explore-capabilities.tsx'
    ),
    './EdgeWidget': path.resolve(
      __dirname,
      'src/components/widgets/edge-widget.tsx'
    ),
    './RhelWidget': path.resolve(
      __dirname,
      'src/components/widgets/rhel-widget.tsx'
    ),
    './AnsibleWidget': path.resolve(
      __dirname,
      'src/components/widgets/ansible-widget.tsx'
    ),
    './OpenShiftWidget': path.resolve(
      __dirname,
      'src/components/widgets/openshift-widget.tsx'
    ),
    './OpenShiftAiWidget': path.resolve(
      __dirname,
      'src/components/widgets/openshift-ai-widget.tsx'
    ),
    './QuayWidget': path.resolve(
      __dirname,
      'src/components/widgets/quay-widget.tsx'
    ),
    './AcsWidget': path.resolve(
      __dirname,
      'src/components/widgets/acs-widget.tsx'
    ),
    './SupportCaseWidget': path.resolve(
      __dirname,
      'src/components/widgets/support-case-widget.tsx'
    ),
  },
  remoteType: 'var',
  shared: [
    {
      react: {
        // @ts-ignore
        singleton: true,
        requiredVersion: '*',
        // import: false,
      },
      'react-dom': {
        // @ts-ignore
        singleton: true,
        requiredVersion: '*',
        // import: false,
      },
      // 'shared-package': {
      //   // @ts-ignore
      //   singleton: true,
      //   requiredVersion: '>=1.0.0',
      // },
      'react-router-dom': {
        // @ts-ignore
        singleton: true,
        requiredVersion: '*',
        // import: false,
      },
      '@scalprum/core': {
        // @ts-ignore
        singleton: true,
        requiredVersion: '*',
        // import: false,
      },
      '@scalprum/react-core': {
        // @ts-ignore
        singleton: true,
        requiredVersion: '*',
        // import: false,
      },
      '@openshift/dynamic-plugin-sdk': {
        // @ts-ignore
        singleton: true,
        requiredVersion: '*',
      },
      // '@patternfly/quickstarts': {
      //   // @ts-ignore
      //   singleton: true,
      //   requiredVersion: '*',
      // },
      '@unleash/proxy-client-react': {
        // @ts-ignore
        singleton: true,
        requiredVersion: '*',
      },
    },
  ],
});

export default defineConfig({
  build: {
    minify: false,
    outDir: 'dist/apps/landing',
    assetsDir: '',
  },
  base: '/apps/landing',
  plugins: [
    react(),
    MFPlugin,
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'fed-mods.json',
    //       dest: 'dist/apps/landing',
    //     },
    //   ],
    // }),
  ],
});
