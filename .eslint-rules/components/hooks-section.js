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
                'Enforce that React hooks are only in a HOOKS section, and a HOOKS section contains only those declarations',
        },
        schema: [],
        messages: {
            mustBeInHooks: '{{ name }} calls must be inside a HOOKS section.',
            mustBeAllowedHook:
                'Only React hook declarations are allowed in a HOOKS section.',
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'HOOKS', context);

        const range = findSectionRange(comments, 'HOOKS');

        const ALLOWED_HOOKS = new Set([
            'useRef',
            'usePathname',
            'useReducer',
            'useRouter',
            'useSearchParams',
            'useSession',
        ]);

        function getAllowedHookName(node) {
            if (!node || node.type !== 'CallExpression') return null;
            const { callee } = node;
            if (
                callee.type === 'Identifier' &&
                ALLOWED_HOOKS.has(callee.name)
            ) {
                return callee.name;
            }
            if (
                callee.type === 'MemberExpression' &&
                callee.object.type === 'Identifier' &&
                callee.object.name === 'React' &&
                callee.property.type === 'Identifier' &&
                ALLOWED_HOOKS.has(callee.property.name)
            ) {
                return callee.property.name;
            }
            return null;
        }

        return {
            CallExpression(node) {
                const name = getAllowedHookName(node);
                if (!name) return;
                if (inRange(node, range)) return;

                context.report({
                    node,
                    messageId: 'mustBeInHooks',
                    data: { name },
                });
            },

            VariableDeclaration(node) {
                if (!inRange(node, range)) return;

                const allAllowed = node.declarations.every(
                    (declarator) => getAllowedHookName(declarator.init) !== null
                );

                if (!allAllowed) {
                    context.report({ node, messageId: 'mustBeAllowedHook' });
                }
            },
        };
    },
};
