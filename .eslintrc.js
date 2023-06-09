module.exports = {
  extends: ["plugin:jsx-a11y/recommended"],
  plugins: ["jsx-a11y"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-unused-vars": ["error", { vars: "all", argsIgnorePattern: "^_" }],
    "no-console": 0,
  },
};
