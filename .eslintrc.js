module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  globals: {
    "no-irregular-whitespace": true
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "linebreak-style": 0,
    "semi": ["error", "never"]
  }
}
