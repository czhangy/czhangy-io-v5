const path = require('path');
const fs = require('fs');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforces directory naming, and .module.scss naming conventions for component files.',
        },
        messages: {
            wrongDirectory:
                '"{{name}}.tsx" must be inside a directory named "{{name}}".',
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

                let siblings;
                try {
                    siblings = fs.readdirSync(dir);
                } catch {
                    return;
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
