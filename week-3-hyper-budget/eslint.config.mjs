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
  {
    rules: {
      // Several effects intentionally react to a server-action result (useActionState)
      // to close a dialog, show a "Logged" confirmation, and refresh. That is a valid
      // use of useEffect (syncing with an external event), so we keep this rule as a
      // visible warning instead of failing the build on it.
      "react-hooks/set-state-in-effect": "warn",
      // Allow intentionally-unused args/vars prefixed with "_", e.g. the _prev and
      // _formData parameters in server actions whose signature is fixed by
      // useActionState.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
