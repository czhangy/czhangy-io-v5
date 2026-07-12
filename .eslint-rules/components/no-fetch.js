/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Disallow calling fetch() directly in components. Extract the call into a helper class in src/lib/utils instead.',
        },
        messages: {
            noFetch:
                'Do not call fetch() in components. Extract this call into a helper class in src/lib/utils.',
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'fetch'
                ) {
                    context.report({ node, messageId: 'noFetch' });
                }
            },
        };
    },
};
