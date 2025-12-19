/* eslint-env node */
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import jest from 'eslint-plugin-jest';

export default [

    js.configs.recommended,

    // Ignores
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            'package-lock.json',
            '.nvmrc',
            '.gitignore'
        ],
    },

    // TS config
    // TypeScript configuration
    ...tseslint.configs.recommendedTypeChecked.map(config => ({
        ...config,
        files: ['**/*.{ts,js}'],
    })),

    // Plugin imports
    {
        files: ['**/*.{ts,js}'],
        ...importX.flatConfigs.recommended,
    },
    {
        files: ['**/*.{ts,js}'],
        ...importX.flatConfigs.typescript,
    },

    eslintConfigPrettier,

    // Main TS configuration
    {
        files: ['**/*.{ts,js}'],
        languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: ['./tsconfig.json'],
            tsconfigRootDir: import.meta.dirname,
        },
        },
        settings: {
        'import-x/resolver': {
            typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json'
            }
        }
        },
        rules: {
        // Semicolon rule
        'semi': ['error', 'never'],

        // Import rules
        'import-x/order': ['error', {
            'newlines-between': 'ignore',
            'alphabetize': { order: 'asc', caseInsensitive: true },
            'groups': [['builtin','external'], 'internal', ['parent','sibling','index']],
        }],
        'import-x/newline-after-import': 'error',
        'import-x/no-duplicates': 'error',
        'import-x/no-cycle': ['error', { 'maxDepth': 10 }],

        // TypeScript rules
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/no-unsafe-enum-comparison': 'error',

        // Other rules
        'no-underscore-dangle': ['error', { allow: ['_id', '_etag'] }],
        'react/jsx-filename-extension': 'off',
        },
    },

    // Jest
    // Test files configuration
    ...tseslint.configs.recommendedTypeChecked.map(config => ({
        ...config,
        files: ['**/tests/**', '**/__tests__/**', '*.spec.ts', '*.test.ts', '**/__tests__/__utils__/*.ts'],
    })),
    {
        files: ['**/tests/**', '**/__tests__/**', '*.spec.ts', '*.test.ts', '**/__tests__/__utils__/*.ts'],
        plugins: {
        jest,
        },
        languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: ['./tsconfig.json'],
            tsconfigRootDir: import.meta.dirname,
        },
        },
        rules: {
        ...jest.configs.style.rules,
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        'jest/unbound-method': 'warn',
        'jest/no-identical-title': 'error'
        },
    },
];