import { createRequire } from 'module';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const require = createRequire(import.meta.url);

const localCodeStyleRules = {
    'no-parent-imports': require('./.eslint-rules/code-style/no-parent-imports.js'),
    'no-export-type': require('./.eslint-rules/code-style/no-export-type.js'),
    'no-empty-section': require('./.eslint-rules/code-style/no-empty-section.js'),
};

const localComponentRules = {
    'filename-export-match': require('./.eslint-rules/components/filename-export-match.js'),
    'component-structure': require('./.eslint-rules/components/component-structure.js'),
    'props-convention': require('./.eslint-rules/components/props-convention.js'),
    'no-module-level-code': require('./.eslint-rules/components/no-module-level-code.js'),
    'component-sections': require('./.eslint-rules/components/component-sections.js'),
    'no-fetch': require('./.eslint-rules/components/no-fetch.js'),
};

const localLibRules = {
    'utils-helpers-naming': require('./.eslint-rules/lib/utils-helpers-naming.js'),
    'static-ts-only': require('./.eslint-rules/lib/static-ts-only.js'),
    'styles-scss-only': require('./.eslint-rules/lib/styles-scss-only.js'),
    'scripts-ts-only': require('./.eslint-rules/lib/scripts-ts-only.js'),
    'icons-naming': require('./.eslint-rules/lib/icons-naming.js'),
    'icons-svg-root': require('./.eslint-rules/lib/icons-svg-root.js'),
    'utils-class-only': require('./.eslint-rules/lib/utils-class-only.js'),
    'utils-class-sections': require('./.eslint-rules/lib/utils-class-sections.js'),
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
            'local/no-empty-section': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },
    {
        files: ['src/components/**/*.tsx'],
        plugins: { component: { rules: localComponentRules } },
        rules: {
            'component/filename-export-match': 'error',
            'component/component-structure': 'error',
            'component/props-convention': 'error',
            'component/no-module-level-code': 'error',
            'component/component-sections': 'error',
            'component/no-fetch': 'error',
        },
    },
    {
        plugins: { lib: { rules: localLibRules } },
    },
    {
        files: ['src/lib/utils/**/*.{ts,tsx,js}'],
        rules: {
            'lib/utils-helpers-naming': 'error',
            'lib/utils-class-only': 'error',
            'lib/utils-class-sections': 'error',
        },
    },
    {
        files: ['src/lib/static/**/*.tsx'],
        rules: {
            'lib/static-ts-only': 'error',
        },
    },
    {
        files: ['src/lib/styles/**/*.{ts,tsx,js}'],
        rules: {
            'lib/styles-scss-only': 'error',
        },
    },
    {
        files: ['src/lib/scripts/**/*.{ts,tsx,js}'],
        rules: {
            'lib/scripts-ts-only': 'error',
        },
    },
    {
        files: ['src/lib/icons/**/*.{ts,tsx,js}'],
        rules: {
            'lib/icons-naming': 'error',
        },
    },
    {
        files: ['src/lib/icons/**/*.tsx'],
        rules: {
            'lib/icons-svg-root': 'error',
        },
    },
]);

export default eslintConfig;
