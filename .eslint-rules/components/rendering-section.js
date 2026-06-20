const {
    findSectionRange,
    validateSectionHeader,
    inRange,
} = require('../utils/sections');

const CAMEL_CASE = /^[a-z][a-zA-Z0-9]*$/;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce that a RENDERING section contains only camelCase const declarations with type annotations and render* functions, and render* functions only appear in this section',
        },
        schema: [],
        messages: {
            mustBeInRendering:
                "render* function '{{ name }}' must be inside a RENDERING section.",
            mustBeConst: 'Declarations in a RENDERING section must use const.',
            mustBeCamelCase:
                "Declarations in a RENDERING section must be camelCase. '{{ name }}' is not valid.",
            mustBeAnnotated:
                "Constant '{{ name }}' must have an explicit type annotation.",
            renderMustBeFunction:
                "render* declarations in a RENDERING section must be functions. '{{ name }}' is not valid.",
            functionMustStartWithRender:
                "Functions in a RENDERING section must be named starting with 'render'. '{{ name }}' is not valid.",
            noHooks: 'Hook calls are not allowed in a RENDERING section.',
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'RENDERING', context);

        const range = findSectionRange(comments, 'RENDERING');

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

        function isHookCall(node) {
            if (!node || node.type !== 'CallExpression') return false;
            const { callee } = node;
            if (callee.type === 'Identifier')
                return /^use[A-Z]/.test(callee.name);
            if (
                callee.type === 'MemberExpression' &&
                callee.object.type === 'Identifier' &&
                callee.object.name === 'React' &&
                callee.property.type === 'Identifier'
            )
                return /^use[A-Z]/.test(callee.property.name);
            return false;
        }

        function isFunction(node) {
            return (
                node &&
                (node.type === 'ArrowFunctionExpression' ||
                    node.type === 'FunctionExpression')
            );
        }

        return {
            VariableDeclaration(node) {
                if (!isDirectlyInComponent(node)) return;

                if (inRange(node, range)) {
                    if (node.kind !== 'const') {
                        context.report({ node, messageId: 'mustBeConst' });
                        return;
                    }

                    for (const declarator of node.declarations) {
                        const name = declarator.id?.name;
                        if (!name) continue;

                        if (isHookCall(declarator.init)) {
                            context.report({
                                node: declarator,
                                messageId: 'noHooks',
                            });
                            continue;
                        }

                        if (!CAMEL_CASE.test(name)) {
                            context.report({
                                node: declarator.id,
                                messageId: 'mustBeCamelCase',
                                data: { name },
                            });
                            continue;
                        }

                        if (name.startsWith('render')) {
                            if (!isFunction(declarator.init)) {
                                context.report({
                                    node: declarator.id,
                                    messageId: 'renderMustBeFunction',
                                    data: { name },
                                });
                            }
                        } else {
                            if (isFunction(declarator.init)) {
                                context.report({
                                    node: declarator.id,
                                    messageId: 'functionMustStartWithRender',
                                    data: { name },
                                });
                            } else if (!declarator.id.typeAnnotation) {
                                context.report({
                                    node: declarator.id,
                                    messageId: 'mustBeAnnotated',
                                    data: { name },
                                });
                            }
                        }
                    }
                } else {
                    for (const declarator of node.declarations) {
                        const name = declarator.id?.name;
                        if (
                            name &&
                            name.startsWith('render') &&
                            isFunction(declarator.init)
                        ) {
                            context.report({
                                node: declarator.id,
                                messageId: 'mustBeInRendering',
                                data: { name },
                            });
                        }
                    }
                }
            },

            FunctionDeclaration(node) {
                if (!isDirectlyInComponent(node)) return;

                const name = node.id?.name;
                if (!name) return;

                if (inRange(node, range)) {
                    if (!name.startsWith('render')) {
                        context.report({
                            node: node.id,
                            messageId: 'mustBeCamelCase',
                            data: { name },
                        });
                    }
                } else {
                    if (name.startsWith('render')) {
                        context.report({
                            node: node.id,
                            messageId: 'mustBeInRendering',
                            data: { name },
                        });
                    }
                }
            },
        };
    },
};
