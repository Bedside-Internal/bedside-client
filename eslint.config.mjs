import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Ban raw fetch() / credentials:"include" everywhere except the two
  // centralized API helpers — see lib/api/server-fetch.ts and
  // lib/api/use-api-fetch.ts. This is what stops the Bearer-token pattern
  // from silently regressing back to cookie-forwarding in some new file.
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "lib/api/server-fetch.ts",
      "lib/api/use-api-fetch.ts",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch']",
          message:
            "Don't call fetch() directly. Use serverApiFetch (Server Components/Actions) from '@/lib/api/server-fetch' or useApiFetch() (client components) from '@/lib/api/use-api-fetch' — they attach the Bearer token automatically.",
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "credentials",
          message:
            "credentials: \"include\" is banned — this project uses Bearer tokens, not cookie forwarding.",
        },
      ],
    },
  },
]);

export default eslintConfig;