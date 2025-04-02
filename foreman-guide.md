# Integrate module to Satellite UI

## Starting the asset server

First step is to install dependencies using `npm i`

Second step is choosing the pathname fragment that is supposed to be used in "Fake CDN".

Open the `frontend.yml` file and change the entry `objects[0].spec.frontend.paths[0]` currently it is set to `/foo/bar`. Meaning that the assets will be available on `http://localhost:8003/foo/bar`.

Once pathname is set, run the `npm run static` command. This will start a asset server on `http://localhost:8003/<configured pathname>`. If you need to change the port add it as an argument:
```sh
npm run static -- -p=8004
```

## Using automated `publicPath` in Scalprum

Make sure that `@scalprum/core` and `@scalprum/react-core` are installed in your shell and shared as singleton module in your module federation config.

By default Scalprum expects a public path to be a valid pathname. Modules that use the `publicPath: 'auto'` option have to provide the origin and pathname to where the initial scripts are located and mutate the load scripts for plugin manifest.


It is recommended to add an attribute to Scalprum config and then use that in the transform manifest sdk option:

```jsx
import { AppsConfig } from '@scalprum/core';
import { ScalprumProvider } from '@scalprum/react-core'

const config: AppsConfig<{cdnPath?: string}> = {
  landing: {
    name: 'landing',
    manifestLocation: 'http://localhost:8003/server/foo/landing/fed-mods.json',
    cdnPath: 'http://localhost:8003/server/foo/landing/'
  }
}


const Root = () => {
  return (
    <ScalprumProvider config={config} pluginSDKOptions={{
      pluginLoaderOptions: {
        transformPluginManifest: (manifest) => {
          if(manifest.baseURL === 'auto' && config[manifest.name]?.cdnPath) {
            const cdnPath = config[manifest.name]?.cdnPath
            const newManifest = {
              ...manifest
              baseURL: cdnPath
              loadScripts: manifest.loadScripts.map((script) => `${cdnPath}${script}`)
            }
            return newManifest
          }
          return manifest
        }
      }
    }}>
      <ScalprumComponent scope="landing" module="./ExploreCapabilities">
    </ScalprumProvider>
  )
}

```
