// Polyfills for kaabalah (Swiss Ephemeris) in vitest ESM context
// kaabalah uses CJS constructs (__dirname, require) internally
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

// Provide CJS require function to ESM context
// @ts-expect-error — vitest runs ESM, kaabalah needs CJS require
globalThis.require = createRequire(import.meta.url);

// Provide __dirname pointing to kaabalah's dist (where WASM files are)
// @ts-expect-error — __dirname is not defined in ESM
globalThis.__dirname = resolve(process.cwd(), 'node_modules/kaabalah/dist');
