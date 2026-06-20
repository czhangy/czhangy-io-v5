const SECTION_ORDER = [
    'CONSTANTS',
    'HOOKS',
    'STATE',
    'HANDLERS',
    'COMPUTATIONS',
    'RENDERING',
    'EFFECTS',
    'MARKUP',
];

const DIVIDER_PATTERN = /^-{20,}$/;

function isDivider(comment) {
    return (
        comment.type === 'Line' && DIVIDER_PATTERN.test(comment.value.trim())
    );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce that component sections appear in the correct order, with no duplicates, unknown sections, or empty sections',
        },
        schema: [],
        messages: {
            unknownSection:
                "Unknown section '{{ name }}'. Valid sections are: {{ valid }}.",
            duplicateSection: "Section '{{ name }}' appears more than once.",
            wrongOrder:
                "Section '{{ name }}' is out of order. Required order: {{ order }}.",
            emptySection: "Section '{{ name }}' is empty.",
        },
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const comments = sourceCode.getAllComments();
        const fullText = sourceCode.getText();

        // Collect all section header label comments (triplet: divider, label, divider).
        // The three comments must be on consecutive lines to avoid false positives
        // from closing/opening dividers of adjacent sections flanking a regular comment.
        const sections = [];
        for (let i = 0; i < comments.length - 2; i++) {
            const a = comments[i];
            const b = comments[i + 1];
            const c = comments[i + 2];
            if (
                isDivider(a) &&
                b.type === 'Line' &&
                isDivider(c) &&
                b.loc.start.line === a.loc.end.line + 1 &&
                c.loc.start.line === b.loc.end.line + 1
            ) {
                sections.push({
                    name: b.value.trim(),
                    loc: b.loc,
                    headerStart: a.range[0],
                    headerEnd: c.range[1],
                });
            }
        }

        return {
            Program() {
                const seen = new Set();
                let maxOrderIndex = -1;

                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    const { name } = section;
                    const orderIndex = SECTION_ORDER.indexOf(name);

                    if (orderIndex === -1) {
                        context.report({
                            loc: section.loc,
                            messageId: 'unknownSection',
                            data: {
                                name,
                                valid: SECTION_ORDER.join(', '),
                            },
                        });
                        continue;
                    }

                    if (seen.has(name)) {
                        context.report({
                            loc: section.loc,
                            messageId: 'duplicateSection',
                            data: { name },
                        });
                        continue;
                    }

                    if (orderIndex < maxOrderIndex) {
                        context.report({
                            loc: section.loc,
                            messageId: 'wrongOrder',
                            data: {
                                name,
                                order: SECTION_ORDER.join(' → '),
                            },
                        });
                    }

                    // Check for empty body: slice text between this section's header
                    // and the next section's opening divider (or end of source).
                    const bodyStart = section.headerEnd;
                    const bodyEnd =
                        i + 1 < sections.length
                            ? sections[i + 1].headerStart
                            : fullText.length;
                    const bodyText = fullText.slice(bodyStart, bodyEnd);
                    const stripped = bodyText
                        .replace(/\/\/[^\n]*/g, '')
                        .replace(/\/\*[\s\S]*?\*\//g, '');
                    if (!stripped.trim()) {
                        context.report({
                            loc: section.loc,
                            messageId: 'emptySection',
                            data: { name },
                        });
                    }

                    seen.add(name);
                    maxOrderIndex = Math.max(maxOrderIndex, orderIndex);
                }
            },
        };
    },
};
