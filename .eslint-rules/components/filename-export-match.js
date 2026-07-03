const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'The default export name must match the filename (without extension).',
        },
        messages: {
            nameMismatch:
                'Default export "{{name}}" must match the filename "{{filename}}".',
        },
        schema: [],
    },
    create(context) {
        const basename = path.basename(
            context.filename,
            path.extname(context.filename)
        );

        return {
            ExportDefaultDeclaration(node) {
                let name = null;

                if (node.declaration.type === 'Identifier') {
                    name = node.declaration.name;
                } else if (
                    (node.declaration.type === 'FunctionDeclaration' ||
                        node.declaration.type === 'ClassDeclaration') &&
                    node.declaration.id
                ) {
                    name = node.declaration.id.name;
                }

                if (name !== null && name !== basename) {
                    context.report({
                        node: node.declaration,
                        messageId: 'nameMismatch',
                        data: { name, filename: basename },
                    });
                }
            },
        };
    },
};
