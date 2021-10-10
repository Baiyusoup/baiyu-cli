module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "es2021": true
  },
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "no-debugger": "warn",
    "no-console": "warn",
    "eslint-comments/disable-enable-pair": [
      "warn",
      {
        "allowWholeFile": true
      }
    ]
  }
}