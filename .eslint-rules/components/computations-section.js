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
                'Enforce that the COMPUTATIONS section contains only function declarations',
        },
        schema: [],
        messages: {
            mustBeFunction:
                'Only function declarations are allowed in the COMPUTATIONS section.',
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'COMPUTATIONS', context);

        const range = findSectionRange(comments, 'COMPUTATIONS');

        function isPascalCase(name) {
            return typeof name === 'string' && /^[A-Z]/.test(name);
        }

        function isDirectlyInComponent(node) {
            const parent = node.parent;
            if (!parent || parent.type !== 'BlockStatement') return false;
            const grandParent = parent.parent;
            if (!grandParent) return false;

            if (grandParent.type === 'FunctionDeclaration') {
                return isPascalCase(grandParent.id?.name);
            }
            if (
                grandParent.type === 'ArrowFunctionExpression' ||
                grandParent.type === 'FunctionExpression'
            ) {
                const ggParent = grandParent.parent;
                return (
                    ggParent?.type === 'VariableDeclarator' &&
                    isPascalCase(ggParent.id?.name)
                );
            }
            return false;
        }

        function isAllowedInit(node) {
            if (!node) return false;
            if (
                node.type === 'ArrowFunctionExpression' ||
                node.type === 'FunctionExpression'
            )
                return true;
            if (node.type === 'CallExpression') {
                const { callee } = node;
                if (callee.type === 'Identifier')
                    return callee.name === 'useMemo';
                if (
                    callee.type === 'MemberExpression' &&
                    callee.object.type === 'Identifier' &&
                    callee.object.name === 'React' &&
                    callee.property.type === 'Identifier' &&
                    callee.property.name === 'useMemo'
                )
                    return true;
            }
            return false;
        }

        return {
            VariableDeclaration(node) {
                if (!isDirectlyInComponent(node)) return;
                if (!inRange(node, range)) return;

                const allAllowed = node.declarations.every((declarator) =>
                    isAllowedInit(declarator.init)
                );

                if (!allAllowed) {
                    context.report({ node, messageId: 'mustBeFunction' });
                }
            },
        };
    },
};
