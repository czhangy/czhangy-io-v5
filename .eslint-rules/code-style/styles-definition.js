const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce SCSS import rules and dot notation for single-word CSS module class references',
        },
        fixable: 'code',
        schema: [],
        messages: {
            wrongFile:
                "Only the component's own SCSS file ('./{{ expected }}') may be imported.",
            wrongName:
                "The SCSS import must be named 'styles', not '{{ found }}'.",
            useDotNotation:
                "Use dot notation 'styles.{{ name }}' instead of bracket notation for single-word class names.",
        },
    },

    create(context) {
        const componentName = path.basename(
            context.filename ?? context.getFilename(),
            '.tsx'
        );
        const expectedSource = `./${componentName}.module.scss`;

        return {
            ImportDeclaration(node) {
                const source = node.source.value;
                if (!source.endsWith('.scss')) return;

                if (source !== expectedSource) {
                    context.report({
                        node: node.source,
                        messageId: 'wrongFile',
                        data: { expected: `${componentName}.module.scss` },
                    });
                    return;
                }

                const defaultSpecifier = node.specifiers.find(
                    (s) => s.type === 'ImportDefaultSpecifier'
                );
                if (
                    defaultSpecifier &&
                    defaultSpecifier.local.name !== 'styles'
                ) {
                    context.report({
                        node: defaultSpecifier.local,
                        messageId: 'wrongName',
                        data: { found: defaultSpecifier.local.name },
                        fix: (fixer) =>
                            fixer.replaceText(defaultSpecifier.local, 'styles'),
                    });
                }
            },

            MemberExpression(node) {
                if (!node.computed) return;
                if (node.object.type !== 'Identifier') return;
                if (node.object.name !== 'styles') return;

                const prop = node.property;
                if (prop.type !== 'Literal' || typeof prop.value !== 'string')
                    return;

                const name = prop.value;
                if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
                    context.report({
                        node,
                        messageId: 'useDotNotation',
                        data: { name },
                        fix: (fixer) =>
                            fixer.replaceText(node, `styles.${name}`),
                    });
                }
            },
        };
    },
};
