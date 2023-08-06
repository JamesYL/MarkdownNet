module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    node: true,
    mocha: true,
  },
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["**/*.js", "**/*.d.ts"],
  rules: {
    // Opinionated rules
    quotes: [2, "double"],

    // Enforce strict mode
    strict: ["error", "safe"],

    // TypeScript strict rules
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

    // General strict rules
    eqeqeq: "error",
    "no-console": "error",
    "no-debugger": "error",
    "no-undef": "error",
    "no-var": "error",
    "prefer-const": "error",
  },
};
