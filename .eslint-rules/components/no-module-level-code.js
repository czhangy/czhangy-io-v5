const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'No code may be written at module level in component files except imports, directives, the props type, and the component itself.',
        },
        messages: {
            noCodeOutsideComponent:
                'Module-level code is not allowed. Move this inside {{basename}} or extract it to a utility.',
        },
        schema: [],
    },
    create(context) {
        const basename = path.basename(context.filename, '.tsx');
        const expectedTypeName = `${basename}Props`;

        const isAllowed = (node) => {
            switch (node.type) {
                case 'ImportDeclaration':
                    return true;

                // 'use client', 'use server', 'use strict'
                case 'ExpressionStatement':
                    return (
                        node.expression.type === 'Literal' &&
                        typeof node.expression.value === 'string'
                    );

                case 'TSTypeAliasDeclaration':
                    return node.id.name === expectedTypeName;

                case 'TSInterfaceDeclaration':
                    return node.id.name === expectedTypeName;

                // The component variable declaration: must be a single
                // declarator whose name matches the filename.
                case 'VariableDeclaration':
                    return (
                        node.declarations.length === 1 &&
                        node.declarations[0].id.type === 'Identifier' &&
                        node.declarations[0].id.name === basename
                    );

                case 'FunctionDeclaration':
                    return node.id?.name === basename;

                case 'ExportDefaultDeclaration':
                    return true;

                default:
                    return false;
            }
        };

        return {
            Program(node) {
                for (const statement of node.body) {
                    if (!isAllowed(statement)) {
                        context.report({
                            node: statement,
                            messageId: 'noCodeOutsideComponent',
                            data: { basename },
                        });
                    }
                }
            },
        };
    },
};
