const path = require('path');
const fs = require('fs');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforces directory naming, .md co-location, and .module.scss naming conventions for component files.',
        },
        messages: {
            wrongDirectory:
                '"{{name}}.tsx" must be inside a directory named "{{name}}".',
            missingMd: '"{{name}}.tsx" must be co-located with "{{name}}.md".',
            wrongMdName:
                '"{{found}}" must be named "{{expected}}" to match the component.',
            wrongScssName:
                '"{{found}}" must be named "{{expected}}" to match the component.',
        },
        schema: [],
    },
    create(context) {
        return {
            Program(node) {
                const filename = context.filename;
                const dir = path.dirname(filename);
                const basename = path.basename(filename, '.tsx');

                // Non-Page components must live directly inside a directory
                // whose name matches the component name.
                if (!basename.endsWith('Page')) {
                    const dirName = path.basename(dir);
                    if (dirName !== basename) {
                        context.report({
                            node,
                            messageId: 'wrongDirectory',
                            data: { name: basename },
                        });
                    }
                }

                // Every component must be co-located with a .md file of the
                // same name, and any .md file in the directory must share
                // that name.
                let siblings;
                try {
                    siblings = fs.readdirSync(dir);
                } catch {
                    return;
                }

                const expectedMd = `${basename}.md`;
                if (!siblings.includes(expectedMd)) {
                    context.report({
                        node,
                        messageId: 'missingMd',
                        data: { name: basename },
                    });
                }
                for (const file of siblings) {
                    if (file.endsWith('.md') && file !== expectedMd) {
                        context.report({
                            node,
                            messageId: 'wrongMdName',
                            data: { found: file, expected: expectedMd },
                        });
                    }
                }

                // Any .scss file in the same directory must be named
                // ComponentName.module.scss.
                const expectedScss = `${basename}.module.scss`;
                for (const file of siblings) {
                    if (file.endsWith('.scss') && file !== expectedScss) {
                        context.report({
                            node,
                            messageId: 'wrongScssName',
                            data: { found: file, expected: expectedScss },
                        });
                    }
                }
            },
        };
    },
};
