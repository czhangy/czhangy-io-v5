/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'src/lib/styles must only contain .scss files.',
        },
        messages: {
            wrongType: 'Only SCSS files are allowed in src/lib/styles..',
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
