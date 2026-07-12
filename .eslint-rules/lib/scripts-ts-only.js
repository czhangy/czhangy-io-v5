/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Files in src/lib/scripts must be plain .ts files.',
        },
        messages: {
            wrongType: 'Files in src/lib/scripts must be plain .ts files.',
        },
        schema: [],
    },
    create(context) {
        return {
            Program(node) {
                if (!context.filename.endsWith('.ts')) {
                    context.report({ node, messageId: 'wrongType' });
                }
            },
        };
    },
};
