import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next + custom ignores
  globalIgnores([
    // Next.js build artifacts
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores
    "node_modules/**",
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    // PWA generated files
    "public/sw.js",
    "public/workbox-*.js",
    "public/fallback-*.js",
  ]),
  {
    rules: {
      // Suppress React Compiler warnings for react-hook-form's watch() function
      // This is a known limitation where the library returns functions that can't be safely memoized
      'react-hooks/incompatible-library': 'off',
    },
  },
]);

export default eslintConfig;
