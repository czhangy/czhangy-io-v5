const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Files in src/lib/utils must only contain a default-exported class whose name matches the filename.',
        },
        messages: {
            noClass: 'File must default-export a class.',
            nameMismatch:
                'Class name "{{name}}" must match the filename "{{filename}}".',
            extraExport: 'Utils files must not contain named exports.',
        },
        schema: [],
    },
    create(context) {
        const basename = path.basename(context.filename, '.ts');
        let hasDefaultClassExport = false;

        return {
            ExportDefaultDeclaration(node) {
                if (node.declaration.type === 'ClassDeclaration') {
                    hasDefaultClassExport = true;
                    const name = node.declaration.id?.name;
                    if (name && name !== basename) {
                        context.report({
                            node: node.declaration.id,
                            messageId: 'nameMismatch',
                            data: { name, filename: basename },
                        });
                    }
                }
            },

            ExportNamedDeclaration(node) {
                context.report({ node, messageId: 'extraExport' });
            },

            'Program:exit'(node) {
                if (!hasDefaultClassExport) {
                    context.report({ node, messageId: 'noClass' });
                }
            },
        };
    },
};
