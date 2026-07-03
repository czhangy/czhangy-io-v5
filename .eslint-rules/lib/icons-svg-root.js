/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Icon components must be a functional component whose root element is <svg>.',
        },
        messages: {
            noSvgRoot: 'Icon component must render <svg> as its root element.',
            noComponent:
                'Icon file must default-export a functional component.',
        },
        schema: [],
    },
    create(context) {
        let defaultExportName = null;
        const arrowFns = new Map();

        const getSvgRootName = (fn) => {
            const body = fn.body;
            if (body.type === 'JSXElement') {
                return body.openingElement.name.name;
            }
            if (body.type === 'BlockStatement') {
                for (const stmt of body.body) {
                    if (
                        stmt.type === 'ReturnStatement' &&
                        stmt.argument?.type === 'JSXElement'
                    ) {
                        return stmt.argument.openingElement.name.name;
                    }
                }
            }
            return null;
        };

        return {
            VariableDeclarator(node) {
                if (
                    node.id.type === 'Identifier' &&
                    node.init?.type === 'ArrowFunctionExpression'
                ) {
                    arrowFns.set(node.id.name, node.init);
                }
            },

            ExportDefaultDeclaration(node) {
                if (node.declaration.type === 'Identifier') {
                    defaultExportName = node.declaration.name;
                }
            },

            'Program:exit'(node) {
                if (!defaultExportName) {
                    context.report({ node, messageId: 'noComponent' });
                    return;
                }
                const fn = arrowFns.get(defaultExportName);
                if (!fn) {
                    context.report({ node, messageId: 'noComponent' });
                    return;
                }
                if (getSvgRootName(fn) !== 'svg') {
                    context.report({ node: fn, messageId: 'noSvgRoot' });
                }
            },
        };
    },
};
