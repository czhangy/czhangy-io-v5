/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Files in src/lib/static must be plain .ts files.',
        },
        messages: {
            wrongType: 'Files in src/lib/static must be plain .ts files.',
        },
        schema: [],
    },
    create(context) {
        return {
            Program(node) {
                context.report({ node, messageId: 'wrongType' });
            },
        };
    },
};
