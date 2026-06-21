const {
    findSectionRange,
    validateSectionHeader,
} = require('../utils/sections');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce that every component has a MARKUP section containing exactly one return statement that returns JSX or a createPortal call',
        },
        schema: [],
        messages: {
            missingMarkup: 'Component must have a MARKUP section.',
            onlyReturn:
                'The MARKUP section may only contain a single return statement.',
            mustReturnJsx:
                'The MARKUP section must return JSX, a conditional expression, or a createPortal call.',
            missingReturn:
                'The MARKUP section must contain a return statement.',
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();

        validateSectionHeader(comments, 'MARKUP', context);

        const sectionRange = findSectionRange(comments, 'MARKUP');

        let exportDefaultNode = null;
        let componentFunctionNode = null;

        function isPascalCase(name) {
            return (
                typeof name === 'string' &&
                /^[A-Z]/.test(name) &&
                /[a-z]/.test(name)
            );
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
            ExportDefaultDeclaration(node) {
                exportDefaultNode = node;
            },

            'ArrowFunctionExpression, FunctionExpression, FunctionDeclaration'(
                node
            ) {
                const name = getFunctionName(node);
                if (isPascalCase(name)) {
                    componentFunctionNode = node;
                }
            },

            'Program:exit'(programNode) {
                if (!sectionRange) {
                    context.report({
                        node: programNode,
                        messageId: 'missingMarkup',
                    });
                    return;
                }

                if (!componentFunctionNode) return;

                const markupEnd = exportDefaultNode
                    ? exportDefaultNode.range[0]
                    : Infinity;
                const markupRange = [sectionRange[0], markupEnd];

                const body = componentFunctionNode.body;
                if (!body || body.type !== 'BlockStatement') return;

                const markupStatements = body.body.filter(
                    (stmt) =>
                        stmt.range[0] >= markupRange[0] &&
                        stmt.range[0] < markupRange[1]
                );

                if (markupStatements.length === 0) {
                    context.report({
                        node: componentFunctionNode,
                        messageId: 'missingReturn',
                    });
                    return;
                }

                if (markupStatements.length > 1) {
                    context.report({
                        node: markupStatements[1],
                        messageId: 'onlyReturn',
                    });
                    return;
                }

                const stmt = markupStatements[0];

                if (stmt.type !== 'ReturnStatement') {
                    context.report({ node: stmt, messageId: 'onlyReturn' });
                    return;
                }

                const arg = stmt.argument;
                const isJsx =
                    arg &&
                    (arg.type === 'JSXElement' || arg.type === 'JSXFragment');
                const isTernary = arg && arg.type === 'ConditionalExpression';
                const isPortal =
                    arg &&
                    arg.type === 'CallExpression' &&
                    arg.callee.type === 'Identifier' &&
                    arg.callee.name === 'createPortal';

                if (!isJsx && !isTernary && !isPortal) {
                    context.report({ node: stmt, messageId: 'mustReturnJsx' });
                }
            },
        };
    },
};
