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
                'Enforce that useEffect hooks are only in an EFFECTS section, and an EFFECTS section contains only useEffect calls',
        },
        schema: [],
        messages: {
            mustBeInEffects:
                'useEffect calls must be inside an EFFECTS section.',
            mustBeUseEffect:
                'Only useEffect calls are allowed in an EFFECTS section.',
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'EFFECTS', context);

        const range = findSectionRange(comments, 'EFFECTS');

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

        function isUseEffectCall(node) {
            if (!node || node.type !== 'CallExpression') return false;
            const { callee } = node;
            if (callee.type === 'Identifier')
                return callee.name === 'useEffect';
            if (
                callee.type === 'MemberExpression' &&
                callee.object.type === 'Identifier' &&
                callee.object.name === 'React' &&
                callee.property.type === 'Identifier' &&
                callee.property.name === 'useEffect'
            )
                return true;
            return false;
        }

        return {
            CallExpression(node) {
                if (!isUseEffectCall(node)) return;
                if (inRange(node, range)) return;

                context.report({ node, messageId: 'mustBeInEffects' });
            },

            ExpressionStatement(node) {
                if (!inRange(node, range)) return;
                if (!isDirectlyInComponent(node)) return;
                if (isUseEffectCall(node.expression)) return;

                context.report({ node, messageId: 'mustBeUseEffect' });
            },
        };
    },
};
