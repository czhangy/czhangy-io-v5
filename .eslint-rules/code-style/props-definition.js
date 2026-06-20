const path = require('path');

const DESTRUCT_CATEGORY_ORDER = {
    required: 0,
    'optional-no-default': 1,
    'optional-with-default': 2,
    function: 3,
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce that the props type is named ComponentNameProps, destructured props are ordered correctly, and the type definition matches the destructuring order',
        },
        fixable: 'code',
        schema: [],
        messages: {
            wrongName:
                "Props type must be named '{{ expected }}', not '{{ found }}'.",
            noDestructure:
                'Component props must be destructured in the function signature. Use ({ prop }) instead of (props).',
            destructureOrderError:
                "Prop '{{ name }}' ({{ category }}) is out of order. Destructured props must be ordered: required, optional, optional with defaults, then function props.",
            typeOrderError:
                "Prop '{{ name }}' in the type definition is out of order. The type must match the destructuring order.",
        },
    },

    create(context) {
        const componentName = path.basename(
            context.filename ?? context.getFilename(),
            '.tsx'
        );
        const expected = `${componentName}Props`;

        // { name, category, node }[] — populated from TSTypeAliasDeclaration
        let propsTypeMembers = null;

        // string[] — prop names in destructuring order, populated from function visitor
        let destructOrder = null;

        function isFunctionType(typeAnnotation) {
            return typeAnnotation?.type === 'TSFunctionType';
        }

        function getMemberCategory(member) {
            const typeAnnotation = member.typeAnnotation?.typeAnnotation;
            if (isFunctionType(typeAnnotation)) return 'function';
            return member.optional ? 'optional' : 'required';
        }

        function isPascalCase(name) {
            return typeof name === 'string' && /^[A-Z]/.test(name);
        }

        function getFunctionName(node) {
            if (node.id && node.id.name) return node.id.name;
            const parent = node.parent;
            if (parent && parent.type === 'VariableDeclarator' && parent.id) {
                return parent.id.name;
            }
            return null;
        }

        return {
            TSTypeAliasDeclaration(node) {
                const found = node.id.name;

                if (found.endsWith('Props') && found !== expected) {
                    const sourceCode =
                        context.sourceCode ?? context.getSourceCode();
                    const fullText = sourceCode.getText();

                    context.report({
                        node: node.id,
                        messageId: 'wrongName',
                        data: { found, expected },
                        fix(fixer) {
                            const fixes = [];
                            const regex = new RegExp(`\\b${found}\\b`, 'g');
                            let match;
                            while ((match = regex.exec(fullText)) !== null) {
                                fixes.push(
                                    fixer.replaceTextRange(
                                        [
                                            match.index,
                                            match.index + found.length,
                                        ],
                                        expected
                                    )
                                );
                            }
                            return fixes;
                        },
                    });
                }

                if (found !== expected) return;

                const typeLiteral = node.typeAnnotation;
                if (typeLiteral?.type !== 'TSTypeLiteral') return;

                propsTypeMembers = typeLiteral.members
                    .filter((m) => m.type === 'TSPropertySignature')
                    .map((m) => ({
                        name: m.key.name ?? m.key.value,
                        category: getMemberCategory(m),
                        node: m,
                    }));
            },

            'ArrowFunctionExpression, FunctionExpression, FunctionDeclaration'(
                node
            ) {
                const name = getFunctionName(node);
                if (!isPascalCase(name)) return;
                if (node.params.length === 0) return;

                const firstParam = node.params[0];

                if (firstParam.type === 'Identifier') {
                    context.report({
                        node: firstParam,
                        messageId: 'noDestructure',
                    });
                    return;
                }

                if (firstParam.type !== 'ObjectPattern' || !propsTypeMembers)
                    return;

                const destructProps = firstParam.properties
                    .filter((p) => p.type === 'Property')
                    .map((p) => {
                        const propName = p.key.name ?? p.key.value;
                        const hasDefault =
                            p.value?.type === 'AssignmentPattern';
                        const typeMember = propsTypeMembers.find(
                            (m) => m.name === propName
                        );

                        let destructCategory;
                        if (!typeMember) {
                            destructCategory = 'unknown';
                        } else if (typeMember.category === 'function') {
                            destructCategory = 'function';
                        } else if (typeMember.category === 'required') {
                            destructCategory = 'required';
                        } else {
                            destructCategory = hasDefault
                                ? 'optional-with-default'
                                : 'optional-no-default';
                        }

                        return { name: propName, destructCategory, node: p };
                    });

                // Check destructuring category order
                let maxCategoryOrder = -1;

                for (const prop of destructProps) {
                    if (prop.destructCategory === 'unknown') continue;

                    const categoryOrder =
                        DESTRUCT_CATEGORY_ORDER[prop.destructCategory];

                    if (categoryOrder < maxCategoryOrder) {
                        context.report({
                            node: prop.node,
                            messageId: 'destructureOrderError',
                            data: {
                                name: prop.name,
                                category: prop.destructCategory,
                            },
                        });
                    } else {
                        maxCategoryOrder = Math.max(
                            maxCategoryOrder,
                            categoryOrder
                        );
                    }
                }

                // Store destructuring order for type definition check
                destructOrder = destructProps.map((p) => p.name);
            },

            'Program:exit'() {
                if (!propsTypeMembers || !destructOrder) return;

                // Build a lookup of prop name -> position in destructuring
                const destructPositions = {};
                destructOrder.forEach((name, i) => {
                    destructPositions[name] = i;
                });

                // Type definition members must appear in the same order as the destructuring
                let maxDestructPos = -1;
                for (const member of propsTypeMembers) {
                    const pos = destructPositions[member.name] ?? -1;
                    if (pos === -1) continue;

                    if (pos < maxDestructPos) {
                        context.report({
                            node: member.node,
                            messageId: 'typeOrderError',
                            data: { name: member.name },
                        });
                    } else {
                        maxDestructPos = pos;
                    }
                }
            },
        };
    },
};
