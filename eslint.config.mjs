import { createRequire } from 'module';

import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const require = createRequire(import.meta.url);

const localComponentRules = {
    'constants-section': require('./.eslint-rules/components/constants-section.js'),
    'state-section': require('./.eslint-rules/components/state-section.js'),
    'hooks-section': require('./.eslint-rules/components/hooks-section.js'),
    'handlers-section': require('./.eslint-rules/components/handlers-section.js'),
    'computations-section': require('./.eslint-rules/components/computations-section.js'),
    'rendering-section': require('./.eslint-rules/components/rendering-section.js'),
    'effects-section': require('./.eslint-rules/components/effects-section.js'),
    'markup-section': require('./.eslint-rules/components/markup-section.js'),
    'file-structure': require('./.eslint-rules/components/file-structure.js'),
    'section-definition': require('./.eslint-rules/code-style/section-definition.js'),
    'props-definition': require('./.eslint-rules/code-style/props-definition.js'),
    'styles-definition': require('./.eslint-rules/code-style/styles-definition.js'),
};

const localIconRules = require('./.eslint-rules/icons/icons.js');

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
        files: ['src/components/**/*.tsx'],
        ignores: ['src/components/icons/**/*.tsx'],
        plugins: { local: { rules: localComponentRules } },
        rules: {
            'local/constants-section': 'error',
            'local/state-section': 'error',
            'local/hooks-section': 'error',
            'local/handlers-section': 'error',
            'local/computations-section': 'error',
            'local/rendering-section': 'error',
            'local/effects-section': 'error',
            'local/markup-section': 'error',
            'local/file-structure': 'error',
            'local/section-definition': 'error',
            'local/props-definition': 'error',
            'local/styles-definition': 'error',
        },
    },
    {
        files: ['src/components/icons/**/*.tsx'],
        plugins: { local: { rules: localIconRules } },
        rules: {
            'local/icons-name-suffix': 'error',
            'local/icons-svg-root': 'error',
            'local/icons-filename-export-match': 'error',
            'local/icons-no-comments': 'error',
            'local/icons-no-forbidden-props': 'error',
        },
    },
]);

export default eslintConfig;
