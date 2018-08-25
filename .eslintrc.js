module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:import/errors"
    ],
    "parserOptions": {
        "ecmaFeatures": {
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {

        //mine
        "no-unused-vars": "warn",
        "no-console": "off",
        "multiline-ternary": "off",
        "no-implicit-coercion": "off",
        "object-property-newline": "off",
        "no-unneeded-ternary": "off",
        "no-floating-decimal": "off",
        "max-lines-per-function": "off",

        //endmine

    }
};
