/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'All class members in src/lib/utils must be inside a // PRIVATE or // PUBLIC section, with access modifiers matching the section.',
        },
        messages: {
            noSection:
                'Class member must be inside a // PRIVATE or // PUBLIC section.',
            missingPrivateModifier:
                'Members in the PRIVATE section must have the "private" access modifier.',
            unexpectedPrivateModifier:
                'Members in the PUBLIC section must not have the "private" access modifier.',
        },
        schema: [],
    },
    create(context) {
        // Matches the three-line section divider:
        //   // ----...----
        //   // PRIVATE  (or PUBLIC)
        //   // ----...----
        const SECTION_PATTERN =
            /\/\/ -{20,}[\r\n]+[^\n]*\/\/ (PRIVATE|PUBLIC)[^\n]*[\r\n]+[^\n]*\/\/ -{20,}/g;

        return {
            ClassDeclaration(classNode) {
                const fullSource = context.sourceCode.getText();
                const bodyStart = classNode.body.range[0];
                const bodyEnd = classNode.body.range[1];
                const bodySource = fullSource.slice(bodyStart, bodyEnd);

                const sections = [];
                SECTION_PATTERN.lastIndex = 0;
                let match;
                while ((match = SECTION_PATTERN.exec(bodySource)) !== null) {
                    sections.push({
                        type: match[1],
                        endPos: bodyStart + match.index + match[0].length,
                    });
                }

                for (const member of classNode.body.body) {
                    if (member.type === 'StaticBlock') continue;

                    const memberStart = member.range[0];

                    let currentSection = null;
                    for (const section of sections) {
                        if (section.endPos <= memberStart) {
                            currentSection = section.type;
                        }
                    }

                    if (!currentSection) {
                        context.report({
                            node: member,
                            messageId: 'noSection',
                        });
                        continue;
                    }

                    const isPrivate = member.accessibility === 'private';

                    if (currentSection === 'PRIVATE' && !isPrivate) {
                        context.report({
                            node: member,
                            messageId: 'missingPrivateModifier',
                        });
                    }
                    if (currentSection === 'PUBLIC' && isPrivate) {
                        context.report({
                            node: member,
                            messageId: 'unexpectedPrivateModifier',
                        });
                    }
                }
            },
        };
    },
};
