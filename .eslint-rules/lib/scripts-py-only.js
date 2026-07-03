/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'src/lib/scripts must only contain .py files.',
        },
        messages: {
            wrongType: 'Only Python scripts are allowed in lib/scripts/.',
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
