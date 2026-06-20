const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
const iconsNameSuffix = {
    meta: {
        type: 'problem',
        docs: {
            description: 'All icon component names must end in "Icon"',
        },
        schema: [],
        messages: {
            wrongSuffix: "Component name '{{ name }}' must end in 'Icon'.",
        },
    },

    create(context) {
        return {
            VariableDeclarator(node) {
                if (
                    !node.id ||
                    node.id.type !== 'Identifier' ||
                    !node.init ||
                    node.init.type !== 'ArrowFunctionExpression'
                )
                    return;
                const name = node.id.name;
                if (!name.endsWith('Icon')) {
                    context.report({
                        node: node.id,
                        messageId: 'wrongSuffix',
                        data: { name },
                    });
                }
            },
        };
    },
};

/** @type {import('eslint').Rule.RuleModule} */
const iconsSvgRoot = {
    meta: {
        type: 'problem',
        docs: {
            description: 'All icon components must return an <svg> element',
        },
        schema: [],
        messages: {
            notSvg: 'Icon component must return an <svg> element.',
        },
    },

    create(context) {
        return {
            ReturnStatement(node) {
                if (
                    !node.argument ||
                    node.argument.type !== 'JSXElement' ||
                    !node.argument.openingElement
                )
                    return;
                const tagName = node.argument.openingElement.name.name;
                if (tagName !== 'svg') {
                    context.report({
                        node: node.argument.openingElement,
                        messageId: 'notSvg',
                    });
                }
            },
        };
    },
};

/** @type {import('eslint').Rule.RuleModule} */
const iconsFilenameExportMatch = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'The default export name must match the filename (without .tsx)',
        },
        schema: [],
        messages: {
            mismatch:
                "Default export '{{ found }}' does not match filename '{{ expected }}'.",
        },
    },

    create(context) {
        const basename = path.basename(context.filename, '.tsx');

        return {
            ExportDefaultDeclaration(node) {
                if (!node.declaration || node.declaration.type !== 'Identifier')
                    return;
                const exportName = node.declaration.name;
                if (exportName !== basename) {
                    context.report({
                        node: node.declaration,
                        messageId: 'mismatch',
                        data: { found: exportName, expected: basename },
                    });
                }
            },
        };
    },
};

/** @type {import('eslint').Rule.RuleModule} */
const iconsNoComments = {
    meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
            description: 'No comments allowed in icon files',
        },
        schema: [],
        messages: {
            noComment: 'Comments are not allowed in icon files.',
        },
    },

    create(context) {
        return {
            Program() {
                const src = context.sourceCode.getText();
                const comments = context.sourceCode.getAllComments();
                for (const comment of comments) {
                    context.report({
                        loc: comment.loc,
                        messageId: 'noComment',
                        fix(fixer) {
                            let [start, end] = comment.range;
                            // Eat preceding whitespace back to the newline (or start of file)
                            while (start > 0 && src[start - 1] !== '\n') {
                                start--;
                            }
                            // Eat the trailing newline so the whole line is removed
                            if (src[end] === '\n') end++;
                            return fixer.removeRange([start, end]);
                        },
                    });
                }
            },
        };
    },
};

/** @type {import('eslint').Rule.RuleModule} */
const iconsNoForbiddenProps = {
    meta: {
        type: 'problem',
        fixable: 'code',
        docs: {
            description:
                'The xmlns and version props are forbidden in icon components',
        },
        schema: [],
        messages: {
            forbiddenProp: "Prop '{{ prop }}' is not allowed in icon files.",
        },
    },

    create(context) {
        const FORBIDDEN = new Set(['xmlns', 'version']);

        return {
            JSXAttribute(node) {
                const propName =
                    node.name.type === 'JSXIdentifier' ? node.name.name : null;
                if (propName && FORBIDDEN.has(propName)) {
                    context.report({
                        node: node.name,
                        messageId: 'forbiddenProp',
                        data: { prop: propName },
                        fix: (fixer) => fixer.remove(node),
                    });
                }
            },
        };
    },
};

module.exports = {
    'icons-name-suffix': iconsNameSuffix,
    'icons-svg-root': iconsSvgRoot,
    'icons-filename-export-match': iconsFilenameExportMatch,
    'icons-no-comments': iconsNoComments,
    'icons-no-forbidden-props': iconsNoForbiddenProps,
};
