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
                'Enforce that handle* functions are only in a HANDLERS section, and a HANDLERS section contains only handle* functions',
        },
        schema: [],
        messages: {
            mustBeInHandlers:
                "Function '{{ name }}' must be inside a HANDLERS section.",
            mustBeFunction:
                'Only function declarations are allowed in a HANDLERS section.',
            mustStartWithHandle:
                "Functions in a HANDLERS section must be named starting with 'handle'. '{{ name }}' is not valid.",
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'HANDLERS', context);

        const range = findSectionRange(comments, 'HANDLERS');

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

        function isHandlerValue(node) {
            if (!node) return false;
            if (
                node.type === 'ArrowFunctionExpression' ||
                node.type === 'FunctionExpression'
            )
                return true;
            if (node.type === 'CallExpression') {
                const { callee } = node;
                if (callee.type === 'Identifier')
                    return callee.name === 'useCallback';
                if (
                    callee.type === 'MemberExpression' &&
                    callee.object.type === 'Identifier' &&
                    callee.object.name === 'React' &&
                    callee.property.type === 'Identifier' &&
                    callee.property.name === 'useCallback'
                )
                    return true;
            }
            return false;
        }

        return {
            VariableDeclaration(node) {
                if (!isDirectlyInComponent(node)) return;

                if (inRange(node, range)) {
                    for (const declarator of node.declarations) {
                        if (!isHandlerValue(declarator.init)) {
                            context.report({
                                node: declarator,
                                messageId: 'mustBeFunction',
                            });
                            continue;
                        }

                        const name = declarator.id?.name;
                        if (name && !name.startsWith('handle')) {
                            context.report({
                                node: declarator.id,
                                messageId: 'mustStartWithHandle',
                                data: { name },
                            });
                        }
                    }
                } else {
                    for (const declarator of node.declarations) {
                        if (!isHandlerValue(declarator.init)) continue;

                        const name = declarator.id?.name;
                        if (name && name.startsWith('handle')) {
                            context.report({
                                node: declarator.id,
                                messageId: 'mustBeInHandlers',
                                data: { name },
                            });
                        }
                    }
                }
            },

            FunctionDeclaration(node) {
                if (!isDirectlyInComponent(node)) return;

                const name = node.id?.name;
                if (inRange(node, range)) {
                    if (!name || !name.startsWith('handle')) {
                        context.report({
                            node: node.id ?? node,
                            messageId: 'mustStartWithHandle',
                            data: { name: name ?? '(anonymous)' },
                        });
                    }
                } else {
                    if (name && name.startsWith('handle')) {
                        context.report({
                            node: node.id,
                            messageId: 'mustBeInHandlers',
                            data: { name },
                        });
                    }
                }
            },
        };
    },
};
