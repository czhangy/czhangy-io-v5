const path = require('path');

// Matches the three-line section divider:
//   // ----...----
//   // SECTION_NAME
//   // ----...----
const SECTION_PATTERN =
    /\/\/ -{20,}[\r\n]+[^\n]*\/\/ (CONSTANTS|HOOKS|STATE|HANDLERS|COMPUTATIONS|RENDERING|EFFECTS|MARKUP)[^\n]*[\r\n]+[^\n]*\/\/ -{20,}/g;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforces that all code inside a component function is organized into named sections.',
        },
        messages: {
            noSection:
                'Statement must be inside a section (CONSTANTS, HOOKS, STATE, HANDLERS, COMPUTATIONS, RENDERING, EFFECTS, or MARKUP).',
            wrongSection:
                'This statement belongs in {{expected}}, not {{actual}}.',
            missingMarkup: 'Component must have a MARKUP section.',
        },
        schema: [],
    },
    create(context) {
        let defaultExportName = null;
        const arrowFns = new Map();
        const funcDecls = new Map();

        const getCalleeName = (callee) => {
            if (!callee) return null;
            if (callee.type === 'Identifier') return callee.name;
            if (callee.type === 'MemberExpression')
                return callee.property?.name ?? null;
            return null;
        };

        const classifyStatement = (stmt) => {
            // Type declarations → CONSTANTS
            if (
                stmt.type === 'TSTypeAliasDeclaration' ||
                stmt.type === 'TSInterfaceDeclaration'
            ) {
                return 'CONSTANTS';
            }

            // Return statement → MARKUP
            if (stmt.type === 'ReturnStatement') return 'MARKUP';

            // Standalone call expressions: useEffect/useLayoutEffect → EFFECTS, other use* → HOOKS
            if (
                stmt.type === 'ExpressionStatement' &&
                stmt.expression.type === 'CallExpression'
            ) {
                const callee = getCalleeName(stmt.expression.callee);
                if (callee === 'useEffect' || callee === 'useLayoutEffect')
                    return 'EFFECTS';
                if (callee?.startsWith('use')) return 'HOOKS';
            }

            if (stmt.type === 'VariableDeclaration') {
                const decl = stmt.declarations[0];
                if (!decl) return null;

                const idName =
                    decl.id.type === 'Identifier' ? decl.id.name : null;

                // SCREAMING_SNAKE_CASE → CONSTANTS
                if (idName && /^[A-Z][A-Z0-9_]*$/.test(idName))
                    return 'CONSTANTS';

                // Arrow / function expression
                if (
                    decl.init?.type === 'ArrowFunctionExpression' ||
                    decl.init?.type === 'FunctionExpression'
                ) {
                    if (idName?.startsWith('handle')) return 'HANDLERS';
                    return 'COMPUTATIONS';
                }

                // Hook call
                if (decl.init?.type === 'CallExpression') {
                    const callee = getCalleeName(decl.init.callee);
                    if (callee === 'useState') return 'STATE';
                    if (callee?.startsWith('use')) return 'HOOKS';
                }

                // Everything else that assigns a value
                return 'RENDERING';
            }

            // Named function declarations
            if (stmt.type === 'FunctionDeclaration') {
                const name = stmt.id?.name;
                if (name?.startsWith('handle')) return 'HANDLERS';
                return 'COMPUTATIONS';
            }

            return null;
        };

        const checkFunctionBody = (fn) => {
            if (!fn?.body || fn.body.type !== 'BlockStatement') return;

            const fullSource = context.sourceCode.getText();
            const bodyStart = fn.body.range[0];
            const bodySource = fullSource.slice(bodyStart, fn.body.range[1]);

            const sections = [];
            SECTION_PATTERN.lastIndex = 0;
            let match;
            while ((match = SECTION_PATTERN.exec(bodySource)) !== null) {
                sections.push({
                    name: match[1],
                    endPos: bodyStart + match.index + match[0].length,
                });
            }

            const hasMarkup = sections.some((s) => s.name === 'MARKUP');

            for (const stmt of fn.body.body) {
                const stmtStart = stmt.range[0];

                // Walk the sections in order; the last one whose end falls
                // before the statement start is the active section.
                let currentSection = null;
                for (const section of sections) {
                    if (section.endPos <= stmtStart) {
                        currentSection = section.name;
                    }
                }

                if (!currentSection) {
                    context.report({ node: stmt, messageId: 'noSection' });
                    continue;
                }

                const expected = classifyStatement(stmt);
                if (expected && expected !== currentSection) {
                    context.report({
                        node: stmt,
                        messageId: 'wrongSection',
                        data: { expected, actual: currentSection },
                    });
                }
            }

            if (!hasMarkup) {
                context.report({ node: fn.body, messageId: 'missingMarkup' });
            }
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

            FunctionDeclaration(node) {
                if (node.id?.name) {
                    funcDecls.set(node.id.name, node);
                }
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
                const fn =
                    arrowFns.get(defaultExportName) ??
                    funcDecls.get(defaultExportName);
                checkFunctionBody(fn);
            },
        };
    },
};
