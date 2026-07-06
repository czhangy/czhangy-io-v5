// Matches the three-line section divider convention used throughout this
// codebase, in both components (// HOOKS, // STATE, ...) and utility
// classes (// PRIVATE, // PUBLIC):
//   // ----...----
//   // SECTION_NAME
//   // ----...----
const SECTION_PATTERN =
    /\/\/ -{20,}[\r\n]+[^\n]*\/\/ ([A-Z][A-Z_]*)[^\n]*[\r\n]+[^\n]*\/\/ -{20,}/g;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Disallow section divider comments that contain no statements or members before the next section (or the end of the block).',
        },
        messages: {
            emptySection:
                'Section "{{name}}" is empty. Remove it or add content.',
        },
        schema: [],
    },
    create(context) {
        const checkBody = (node, members) => {
            const fullSource = context.sourceCode.getText();
            const bodyStart = node.range[0];
            const bodySource = fullSource.slice(bodyStart, node.range[1]);

            const sections = [];
            SECTION_PATTERN.lastIndex = 0;
            let match;
            while ((match = SECTION_PATTERN.exec(bodySource)) !== null) {
                sections.push({
                    name: match[1],
                    startPos: bodyStart + match.index,
                    endPos: bodyStart + match.index + match[0].length,
                });
            }

            if (sections.length === 0) return;

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const next = sections[i + 1];
                const rangeEnd = next ? next.startPos : node.range[1];

                const hasMember = members.some(
                    (member) =>
                        member.range[0] >= section.endPos &&
                        member.range[0] < rangeEnd
                );

                if (!hasMember) {
                    context.report({
                        loc: {
                            start: context.sourceCode.getLocFromIndex(
                                section.startPos
                            ),
                            end: context.sourceCode.getLocFromIndex(
                                section.endPos
                            ),
                        },
                        messageId: 'emptySection',
                        data: { name: section.name },
                    });
                }
            }
        };

        return {
            ClassBody(node) {
                checkBody(node, node.body);
            },
            BlockStatement(node) {
                checkBody(node, node.body);
            },
        };
    },
};
