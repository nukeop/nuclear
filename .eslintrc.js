module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "settings": {
    "react": {
      "version": "16.4.1"
    }
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],

    // Best practice
    "eqeqeq": 2,
    "curly": 2,
    "dot-location": [2, "property"],
    "dot-notation": 2,
    "no-alert": 2,

    // Style
    "array-bracket-spacing": 2,
    "brace-style": 2,
    "comma-dangle": 2,
    "comma-spacing": 2,
    "comma-style": 2,
    "eol-last": 2,
    "key-spacing": 2,
    "keyword-spacing": 2,
    "no-lonely-if": 2,
    "no-multiple-empty-lines": 2,
    "no-tabs": 2,
    "semi-style": [2, "last"],
    "spaced-comment": [2, "always"],

    // ES 6
    "arrow-spacing": 2,
    "no-var": 2,

    // React
    "jsx-quotes": [2, "prefer-single"],
    "react/forbid-prop-types": [1, {"forbid": ["any"]}],
    "react/jsx-equals-spacing":[2, "never"],
    "react/jsx-indent": [2, 2],
    "react/jsx-indent-props": [2, 2],
    "react/jsx-key": 1,
    "react/jsx-no-duplicate-props": 2,
    "react/jsx-no-undef": 2,
    "react/jsx-pascal-case": 2,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/jsx-wrap-multilines": 0,
    "react/no-children-prop": 2,
    "react/no-direct-mutation-state": 1,
    "react/no-typos": 2,
    "react/no-unknown-property": 2,
    "react/no-unused-prop-types": 2,
    "react/prefer-es6-class": 1,
    "react/prefer-stateless-function": 1,
    "react/react-in-jsx-scope": 2,
    "react/self-closing-comp": 2
    
  }
};
