const {
    findSectionRange,
    validateSectionHeader,
    inRange,
} = require('../utils/sections');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce that useState hooks are only in a STATE section, and a STATE section contains only useState declarations',
        },
        schema: [],
        messages: {
            mustBeInState: 'useState calls must be inside a STATE section.',
            mustBeUseState:
                'Only useState declarations are allowed in a STATE section.',
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'STATE', context);

        const range = findSectionRange(comments, 'STATE');

        function isUseStateCall(node) {
            if (!node || node.type !== 'CallExpression') return false;
            const { callee } = node;
            if (callee.type === 'Identifier') return callee.name === 'useState';
            if (callee.type === 'MemberExpression') {
                return (
                    callee.object.type === 'Identifier' &&
                    callee.object.name === 'React' &&
                    callee.property.type === 'Identifier' &&
                    callee.property.name === 'useState'
                );
            }
            return false;
        }

        return {
            CallExpression(node) {
                if (!isUseStateCall(node)) return;
                if (inRange(node, range)) return;

                context.report({ node, messageId: 'mustBeInState' });
            },

            VariableDeclaration(node) {
                if (!inRange(node, range)) return;

                const allUseState = node.declarations.every((declarator) =>
                    isUseStateCall(declarator.init)
                );

                if (!allUseState) {
                    context.report({ node, messageId: 'mustBeUseState' });
                }
            },
        };
    },
};
