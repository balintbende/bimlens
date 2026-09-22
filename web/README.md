# web

Frontend for **bimlens**.

Drop an IFC file: it is uploaded to the API for storage and, in parallel, converted and displayed in 3D in the browser with [That Open Engine](https://docs.thatopen.com/intro).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- React Router
- react-dropzone
- That Open Engine (`@thatopen/components`, `@thatopen/fragments`) on three.js, web-ifc (WASM) for IFC parsing

## Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

The viewer is self-contained: web-ifc's `.wasm` files are copied to `/wasm/` by `vite-plugin-static-copy` and the Fragments worker is bundled from `@thatopen/fragments/worker`, so nothing is loaded from a CDN at runtime. The engine (~6 MB) is lazy-loaded when the first file is dropped.
