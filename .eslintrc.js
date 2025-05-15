module.exports = {
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
    settings: {
        
    }
};