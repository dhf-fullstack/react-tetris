module.exports = {
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 9, // =>
    /*ecmaFeatures: {
      experimentalObjectRestSpread: true
    }*/
  },
  env: {
    node: true,
  },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'never'],
  },
}
