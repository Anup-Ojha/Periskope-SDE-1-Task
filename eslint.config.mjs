import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "warn", // Change to 'warn' to not make it an error
    },
  },
  {
    files: ["./src/app/dashboard/components/ChatBox.tsx"],
    rules: {
      "react-hooks/exhaustive-deps": ["warn", {
        additionalHooks: '(useCallback)',
        allowObjectEquality: true,
        // You can specify individual dependencies to ignore like this:
        // "enforceForFunctionComponents": true,
        // "enforceForClassComponents": true,
        // "enforceForInlineCallbacks": true,
        // "enforceForObjectLiterals": true,
        // "enforceForArrays": true,
        // "ignoreSpecificDependencies": ["fetchMessages", "selectedContact", "sendMessage"], // For useCallback on line 73 and 112
        // OR to target specific lines (less ideal but possible):
        "reportUnnecessaryDependencies": false, // This might be too broad
      }],
    },
  },
];

export default eslintConfig;