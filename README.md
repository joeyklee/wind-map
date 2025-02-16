# Wind Map

To run this...

## Setup

Create a `.env` file and add:

```txt
VITE_MAPBOX_ACCESS_TOKEN=<your mapbox access token>
```

```sh
# use the correct
nvm use
# install dependencies
npm i
# run the dev server
npm run dev
```

## Adjusting parameters

If you have different data, you'll need to adjust the parameters in the `Map` and `CanvasWindLayer`!

## Credits

- Core idea via Natue of Code - Dan Shiffman
- Spatial indexing: KDBush
- Mappling libraries: Maplibre, Mapboxgl
- spatial helpers: Turfjs
- datetime handling: Dayjs
- @joeyklee/whateverest-vector

## deploying to gh pages

https://svelte.dev/docs/kit/adapter-static#GitHub-Pages

- make sure to set `prerender=true` in `routes/+layout.js`

## License

This project uses the following open-source libraries:

- **KDBush** (ISC [License](https://github.com/mourner/kdbush/blob/main/LICENSE))
  Copyright (c) 2018 Vladimir Agafonkin

- **Maplibre-gl** ([License](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt))
  Copyright (c) 2023, MapLibre contributors

- **Dayjs** (MIT [License](https://github.com/iamkun/dayjs/blob/dev/LICENSE))
  Copyright (c) 2018-present, iamkun

- **Svelte** (MIT [License](https://github.com/sveltejs/svelte/blob/main/LICENSE.md))
  Copyright (c) 2016-2025 [these people](https://github.com/sveltejs/svelte/graphs/contributors)

- **Turfjs** (MIT [License](https://github.com/Turfjs/turf/blob/master/LICENSE))
  Copyright (c) 2019 Morgan Herlocker

---

Created using vite & sveltekit

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
