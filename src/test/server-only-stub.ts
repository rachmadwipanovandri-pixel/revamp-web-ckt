// `server-only` is a build-time marker with no runtime behaviour. Next resolves
// it during the app build; vitest aliases it here so server modules can be
// unit-tested directly (see vitest.config.ts).
export {};
