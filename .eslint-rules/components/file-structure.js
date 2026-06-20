const fs = require('fs');
const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce component file structure: default export matches filename, co-located .md doc exists, and any SCSS file is named ComponentName.module.scss',
        },
        schema: [],
        messages: {
            nameMismatch:
                "Default export '{{ exportName }}' does not match filename '{{ filename }}'.",
            noName: "Default export must be a named component matching the filename '{{ filename }}'.",
            missingDocs:
                "Component file '{{ filename }}' is missing a co-located .md documentation file.",
            wrongScssName:
                "SCSS file '{{ found }}' must be named '{{ expected }}'.",
        },
    },

    create(context) {
        const filePath = context.filename ?? context.getFilename();
        const componentName = path.basename(filePath, '.tsx');
        const dir = path.dirname(filePath);

        return {
            Program(node) {
                const mdPath = filePath.replace(/\.tsx$/, '.md');
                if (!fs.existsSync(mdPath)) {
                    context.report({
                        node,
                        messageId: 'missingDocs',
                        data: { filename: path.basename(filePath) },
                    });
                }

                const expected = `${componentName}.module.scss`;
                const scssFiles = fs
                    .readdirSync(dir)
                    .filter((f) => f.endsWith('.scss'));

                for (const found of scssFiles) {
                    if (found !== expected) {
                        context.report({
                            node,
                            messageId: 'wrongScssName',
                            data: { found, expected },
                        });
                    }
                }
            },

            ExportDefaultDeclaration(node) {
                const decl = node.declaration;
                let exportName = null;

                if (
                    decl.type === 'FunctionDeclaration' ||
                    decl.type === 'ClassDeclaration'
                ) {
                    exportName = decl.id ? decl.id.name : null;
                } else if (decl.type === 'Identifier') {
                    exportName = decl.name;
                }

                if (!exportName) {
                    context.report({
                        node,
                        messageId: 'noName',
                        data: { filename: componentName },
                    });
                    return;
                }

                if (exportName !== componentName) {
                    context.report({
                        node,
                        messageId: 'nameMismatch',
                        data: { exportName, filename: componentName },
                    });
                }
            },
        };
    },
};
