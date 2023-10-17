module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": "off",
    "no-unused-vars": "off",
    "comma-dangle": "off",
    "max-len": "off",
    "no-tabs": "off",
    "indent": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-trailing-spaces": "off",
    "padded-blocks": "off",
    "eol-last": "off",
    "prefer-const": "off"
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
