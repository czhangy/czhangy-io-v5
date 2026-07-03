const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Files in src/lib/icons must be .tsx files ending in Icon.tsx.',
        },
        messages: {
            wrongName: 'File "{{filename}}" must end in Icon.tsx.',
        },
        schema: [],
    },
    create(context) {
        return {
            Program(node) {
                const basename = path.basename(context.filename);
                if (!basename.endsWith('Icon.tsx')) {
                    context.report({
                        node,
                        messageId: 'wrongName',
                        data: { filename: basename },
                    });
                }
            },
        };
    },
};
