const {
    findSectionRange,
    validateSectionHeader,
    inRange,
} = require('../utils/sections');

const UPPER_SNAKE_CASE = /^[A-Z][A-Z0-9_]*$/;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce CONSTANTS section formatting and content rules',
        },
        schema: [],
        messages: {
            mustBeConst:
                'Declarations in the CONSTANTS section must use const.',
            mustBeUpperSnake:
                "Constants must be named in UPPER_SNAKE_CASE. '{{ name }}' is not valid.",
            mustBeAnnotated:
                "Constant '{{ name }}' must have an explicit type annotation.",
            constMustBeInConstants:
                "Constant '{{ name }}' must be inside a CONSTANTS section.",
            typeMustBeInConstants:
                "Type declaration '{{ name }}' must be inside a CONSTANTS section.",
            enumMustBeInConstants:
                "Enum '{{ name }}' must be inside a CONSTANTS section.",
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'CONSTANTS', context);

        const range = findSectionRange(comments, 'CONSTANTS');

        return {
            VariableDeclaration(node) {
                if (inRange(node, range)) {
                    if (node.kind !== 'const') {
                        context.report({ node, messageId: 'mustBeConst' });
                        return;
                    }

                    for (const declarator of node.declarations) {
                        if (declarator.id.type !== 'Identifier') continue;

                        const { name } = declarator.id;

                        if (!UPPER_SNAKE_CASE.test(name)) {
                            context.report({
                                node: declarator.id,
                                messageId: 'mustBeUpperSnake',
                                data: { name },
                            });
                        }

                        if (!declarator.id.typeAnnotation) {
                            context.report({
                                node: declarator.id,
                                messageId: 'mustBeAnnotated',
                                data: { name },
                            });
                        }
                    }
                } else {
                    if (node.kind !== 'const') return;

                    for (const declarator of node.declarations) {
                        if (
                            declarator.id.type === 'Identifier' &&
                            UPPER_SNAKE_CASE.test(declarator.id.name)
                        ) {
                            context.report({
                                node: declarator.id,
                                messageId: 'constMustBeInConstants',
                                data: { name: declarator.id.name },
                            });
                        }
                    }
                }
            },

            TSEnumDeclaration(node) {
                if (inRange(node, range)) return;

                context.report({
                    node: node.id,
                    messageId: 'enumMustBeInConstants',
                    data: { name: node.id.name },
                });
            },

            TSTypeAliasDeclaration(node) {
                const name = node.id.name;
                if (name.endsWith('Props')) return;
                if (inRange(node, range)) return;

                context.report({
                    node: node.id,
                    messageId: 'typeMustBeInConstants',
                    data: { name },
                });
            },
        };
    },
};
