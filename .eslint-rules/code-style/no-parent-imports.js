/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Disallow parent-relative imports (../). Use @/ alias or a subdirectory-relative path instead.',
        },
        messages: {
            noParentImport:
                'Avoid "../" imports. Use the "@/" alias or a path relative to a subdirectory.',
        },
        schema: [],
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value.startsWith('../')) {
                    context.report({
                        node: node.source,
                        messageId: 'noParentImport',
                    });
                }
            },
        };
    },
};
