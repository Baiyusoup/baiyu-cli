module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['eslint-config-ali/typescript/node', 'prettier', 'prettier/@typescript-eslint'],
};
