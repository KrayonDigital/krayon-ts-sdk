# Krayon TypeScript SDK

This project includes all components of the Krayon TypeScript SDK.

It currently consists of three parts: 
- Core SDK
- WalletConnect SDK
- React + Auth0 SDK

## Core SDK
This is a vanilla TypeScript SDK that contains main Krayon types and API specs, and can be used to make type-safe API calls to the Krayon backend. It uses Axios under the hood, and the axios responses are returned from the API calls.

## WalletConnect SDK
This extends the functionalities to support WalletConnect, and provides the plumbing required for it.

## React + Auth0 SDK
This component gives React bindings for Core and WalletConnect SDKs, and assumes Auth0 is used for authentication.

# How to work with the repo
This repo is a SDK monorepo using the Nx build tool. The SDK packages are located within the SDK directory. If a new package is required, add it using one of the [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators). Individual packages within the SDK should be called like `@krayon/<something>-sdk`.

Most of the packages should be installed (and specified as dependencies) on the top-level of the repo. Each package can use the packages that are installed on top-level, but if necessary, you can run a yarn install for a package individually (not recommended).

Nx will note and recognize which packages and dependencies are used within the packages, and will adjust the output accordingly. 

When importing a Krayon SDK package from within another package, you can simply import it as you usually would (for example, `import { KrayonSDK } from '@krayon/core-sdk'.` )


Each package has a typical `package.json` and a `project.json` file (the latter being an Nx thing). 

## package.json specifics
Keep in mind that `package.json` works a bit differently than usual, you only need to specify part of it, and Nx will figure out the rest and add it as appropriate in the output. For example, you only need to add those dependencies to `package.json` that you want the final user to have to install. If you've used something in the code but haven't specified it as a dep, nx will add it as a peer dependency in the final output.

## project.json
This are nx-level project settings, which you can use to configure how project will be built, linted, etc. The majority of this will be generated via the nx's generators. Here, possible things that need to be configured are bundler settings, and similar.

## tsconfig specifics
The project follows the nx-standard tsconfig settings. Each package has two (or three, in case of test) tsconfig files. The base one is tsconfig.json. We also have tsconfig.lib.json and tsconfig.spec.json for tests. You would normally change things in the package-specific tsconfig.json if you need something specific to the project.

All tsconfigs derive from the repo-level tsconfig.base.json. It's recommended to put all the default tsconfig settings in there rather than on project level individually. This base tsconfig also sets up all the paths required for nice linking between projects. Nx generators will normally take case of that automatically when you use them.

## Important note: external libraries not bundled
Sometimes you want your package to come with a peer dependency such as React or Auth0. You don't normally want to bundle that with the package, but you want the client to install it themselves.

To accomplish this, you might need to adjust your rollup settings within the appropriate project. Failing to do this can lead to problems such as the SDK having its own instance of, say, Auth0 and not working as a consequence.

If you're using `@nx/vite:build` (such as @krayon/react-auth0-sdk), this is achievable in `vite.config.js`, within build.rollupOptions.external (specify a list of packages such as ['react', 'react-dom']).

If using rollup directly (`@nx/rollup:rollup`, like core-sdk), you might need to add a `rollup.config.js` file, and point `project.json` to it. See example of core-sdk how to achieve this (even though core-sdk isn't using external deps).

# How to build and deploy
To build a package, you can use (for `core-sdk`` example):

`yarn nx build core-sdk`

To build all repos, you can use top-level `yarn build`, which simply delegates to nx's run many feature. This build process will take into account the appropriate dependencies (you don't have to worry about the build sequence).

The output will be in the dist/ directory on the root level. Within the directory, each built package gets its directory.

## Dependency graph
You can view the dependency graph using 

`yarn nx graph`

## Manual packing
A short script, `pack_all.sh` is provided for reference (shouldn't really be used). This builds the packages, and uses yarn's pack functionality to create an archive of each one. 

You could use a file created in this manner to include it in a project where you want to use the SDK, without using NPM or similar. If you wanted to include the package from a different directory, you'd do something like:

`./pack_all.sh`

and then, from your project where you want to use the Krayon SDK (using core package as an example):

`yarn add file:/path/to/krayon-ts-sdk/dist/packages/core-sdk/krayon-core-sdk-v0.0.1.tgz"`


## Deployment
TODO:
`yarn nx run-many -t publish`

Individual packages
`yarn nx run core-sdk:publish`

# How to co-develop frontend

## Step 1 - package linking (source)
For each package that you want to co-develop, go to the appropriate directory, and run `yarn link`. For example,
```
cd packages/core-sdk
yarn link
```

It'll automatically be linked under its package name (for example, @krayon/core-sdk).

## Step 2 - package linking (destination)
Having done, go to your target repo which consumes the said package, and run `yarn link @krayon/core-sdk` (replace core-sdk with a different package if required).

## Step 3 - set up tsconfig and build resolution on destination project
The above will now symlink the proper package from this repo to your node_modules from your destination project. Since you're now using a development version of the package, the paths will no longer be the same. 
You'll have to tell the TS compiler that it should open the files from the 'src' dir. To do this, you should merge something like the following to your tsconfig:
```
{
    "compilerOptions": {
        "paths": {
          "@krayon/core-sdk": ["../node_modules/@krayon/core-sdk/src/index.ts"],
          "@krayon/walletconnect-sdk": ["../node_modules/@krayon/walletconnect-sdk/src/index.ts"],
          "@krayon/react-auth0-sdk": ["../node_modules/@krayon/react-auth0-sdk/src/index.ts"]
        }
    }
}
```

You might also run into issues with the build system. For *vite*, you can add resolutions (within `resolve` key) to your vite.config.js:
```
{
  '@krayon/core-sdk': path.resolve(__dirname, `node_modules/@krayon/${sdkName}/src/index.ts`),
  ... // Other krayon packages you might need
}
```
This is essentially the same information as you've added to tsconfig. You can also try to import this from the tsconfig in development mode. Your setup might be a bit different across different build systems.



# General NX info

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).
