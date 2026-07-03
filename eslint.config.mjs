import { createRequire } from 'module';

import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const require = createRequire(import.meta.url);

const localCodeStyleRules = {
    'no-parent-imports': require('./.eslint-rules/code-style/no-parent-imports.js'),
    'no-export-type': require('./.eslint-rules/code-style/no-export-type.js'),
};

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        '.eslint-rules/**',
    ]),
    {
        files: ['src/**/*.{ts,tsx}'],
        plugins: { local: { rules: localCodeStyleRules } },
        rules: {
            'local/no-parent-imports': 'error',
            'local/no-export-type': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },
]);

export default eslintConfig;
