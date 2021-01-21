/* eslint-disable no-undef */
module.exports = {
  extends: ['../.eslintrc.js', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Prevents from using the preferred component typing
    'react/prop-types': 'off',
    // You don't have to import React with React 17+
    'react/react-in-jsx-scope': 'off',
  },
}
