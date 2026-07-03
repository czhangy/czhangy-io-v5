const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforces props destructuring, type naming, and destructure order for component files.',
        },
        messages: {
            notDestructured:
                'Component props must be destructured in the function arguments.',
            wrongPropsTypeName: 'Props type annotation must be "{{expected}}".',
            missingPropsType: '"{{typeName}}" is not defined in this file.',
            wrongDestructureOrder:
                'Props must be destructured in the order defined in "{{typeName}}". Expected: {{expected}}.',
        },
        schema: [],
    },
    create(context) {
        const basename = path.basename(context.filename, '.tsx');
        const expectedTypeName = `${basename}Props`;

        let defaultExportName = null;
        // Maps name → { fn, declaratorNode } for arrow functions
        const arrowFns = new Map();
        const funcDecls = new Map();
        const typeDecls = new Map();

        const getTypePropertyNames = (node) => {
            if (node.type === 'TSTypeAliasDeclaration') {
                const t = node.typeAnnotation;
                if (t.type === 'TSTypeLiteral') {
                    return t.members
                        .filter(
                            (m) =>
                                m.type === 'TSPropertySignature' &&
                                m.key?.type === 'Identifier'
                        )
                        .map((m) => m.key.name);
                }
            }
            if (node.type === 'TSInterfaceDeclaration') {
                return node.body.body
                    .filter(
                        (m) =>
                            m.type === 'TSPropertySignature' &&
                            m.key?.type === 'Identifier'
                    )
                    .map((m) => m.key.name);
            }
            return [];
        };

        // Resolves the props type name from either:
        //   ({ a, b }: ComponentProps) => ...   (param annotation)
        //   const Foo: React.FC<ComponentProps> = ({ a, b }) => ...  (declarator annotation)
        const resolvePropsTypeName = (firstParam, declaratorNode) => {
            const paramAnnotation = firstParam.typeAnnotation?.typeAnnotation;
            if (paramAnnotation?.type === 'TSTypeReference') {
                return paramAnnotation.typeName?.name ?? null;
            }

            if (declaratorNode) {
                const varAnnotation =
                    declaratorNode.id.typeAnnotation?.typeAnnotation;
                if (varAnnotation?.type === 'TSTypeReference') {
                    const typeArgs = varAnnotation.typeArguments?.params;
                    if (
                        typeArgs?.length > 0 &&
                        typeArgs[0].type === 'TSTypeReference'
                    ) {
                        return typeArgs[0].typeName?.name ?? null;
                    }
                }
            }

            return null;
        };

        const checkFunction = (fn, declaratorNode) => {
            if (!fn || fn.params.length === 0) return;

            const firstParam = fn.params[0];

            if (firstParam.type === 'Identifier') {
                context.report({
                    node: firstParam,
                    messageId: 'notDestructured',
                });
                return;
            }

            if (firstParam.type !== 'ObjectPattern') return;

            const typeName = resolvePropsTypeName(firstParam, declaratorNode);

            if (typeName !== expectedTypeName) {
                const reportNode =
                    firstParam.typeAnnotation ??
                    declaratorNode?.id.typeAnnotation ??
                    firstParam;
                context.report({
                    node: reportNode,
                    messageId: 'wrongPropsTypeName',
                    data: { expected: expectedTypeName },
                });
                return;
            }

            const typeNode = typeDecls.get(expectedTypeName);
            if (!typeNode) {
                const reportNode =
                    firstParam.typeAnnotation ??
                    declaratorNode?.id.typeAnnotation ??
                    firstParam;
                context.report({
                    node: reportNode,
                    messageId: 'missingPropsType',
                    data: { typeName: expectedTypeName },
                });
                return;
            }

            const typeOrder = getTypePropertyNames(typeNode);
            if (typeOrder.length === 0) return;

            const destructuredKeys = firstParam.properties
                .filter(
                    (p) => p.type === 'Property' && p.key?.type === 'Identifier'
                )
                .map((p) => p.key.name);

            let lastTypeIdx = -1;
            for (const key of destructuredKeys) {
                const idx = typeOrder.indexOf(key);
                if (idx === -1) continue;
                if (idx < lastTypeIdx) {
                    const expectedOrder = typeOrder.filter((k) =>
                        destructuredKeys.includes(k)
                    );
                    context.report({
                        node: firstParam,
                        messageId: 'wrongDestructureOrder',
                        data: {
                            typeName: expectedTypeName,
                            expected: expectedOrder.join(', '),
                        },
                    });
                    return;
                }
                lastTypeIdx = idx;
            }
        };

        return {
            VariableDeclarator(node) {
                if (
                    node.id.type === 'Identifier' &&
                    node.init?.type === 'ArrowFunctionExpression'
                ) {
                    arrowFns.set(node.id.name, {
                        fn: node.init,
                        declaratorNode: node,
                    });
                }
            },

            FunctionDeclaration(node) {
                if (node.id?.name) {
                    funcDecls.set(node.id.name, node);
                }
            },

            TSTypeAliasDeclaration(node) {
                typeDecls.set(node.id.name, node);
            },

            TSInterfaceDeclaration(node) {
                typeDecls.set(node.id.name, node);
            },

            ExportDefaultDeclaration(node) {
                if (node.declaration.type === 'Identifier') {
                    defaultExportName = node.declaration.name;
                } else if (
                    node.declaration.type === 'FunctionDeclaration' ||
                    node.declaration.type === 'ArrowFunctionExpression'
                ) {
                    funcDecls.set('__default__', node.declaration);
                    defaultExportName = '__default__';
                }
            },

            'Program:exit'() {
                if (!defaultExportName) return;
                const entry = arrowFns.get(defaultExportName);
                if (entry) {
                    checkFunction(entry.fn, entry.declaratorNode);
                } else {
                    const fn = funcDecls.get(defaultExportName);
                    checkFunction(fn, null);
                }
            },
        };
    },
};
