module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "linebreak-style": 0,
    "semi": ["error", "never"]
  }
}
