const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Files in src/lib/utils must be .ts files ending in Helpers.ts.',
        },
        messages: {
            wrongName:
                'File "{{filename}}" must be a .ts file ending in Helpers.ts.',
        },
        schema: [],
    },
    create(context) {
        return {
            Program(node) {
                const basename = path.basename(context.filename);
                if (!basename.endsWith('Helpers.ts')) {
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
