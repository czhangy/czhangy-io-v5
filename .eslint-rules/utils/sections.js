/**
 * Shared utilities for section-based ESLint rules.
 */

const DIVIDER_PATTERN = /^-{20,}$/;

function isDivider(comment) {
    return (
        comment.type === 'Line' && DIVIDER_PATTERN.test(comment.value.trim())
    );
}

/**
 * Returns the range [start, end] of the body of a named section,
 * or null if the section is not found.
 *
 * Body starts after the closing divider of the header and ends
 * before the next divider in the file.
 */
function findSectionRange(comments, sectionName) {
    for (let i = 0; i < comments.length - 2; i++) {
        if (
            isDivider(comments[i]) &&
            comments[i + 1].type === 'Line' &&
            comments[i + 1].value.trim() === sectionName &&
            isDivider(comments[i + 2])
        ) {
            const start = comments[i + 2].range[1];

            let end = Infinity;
            for (let j = i + 3; j < comments.length; j++) {
                if (isDivider(comments[j])) {
                    end = comments[j].range[0];
                    break;
                }
            }

            return [start, end];
        }
    }
    return null;
}

/**
 * Validates that every occurrence of a section label comment is
 * properly surrounded by dividers (divider above, divider below).
 * Reports on the label comment node if not.
 */
function validateSectionHeader(comments, sectionName, context) {
    for (let i = 0; i < comments.length; i++) {
        const c = comments[i];
        if (c.type !== 'Line' || c.value.trim() !== sectionName) continue;

        const above = comments[i - 1];
        const below = comments[i + 1];

        if (!above || !isDivider(above)) {
            context.report({
                loc: c.loc,
                message: `Section '${sectionName}' must be preceded by a divider comment.`,
            });
        }
        if (!below || !isDivider(below)) {
            context.report({
                loc: c.loc,
                message: `Section '${sectionName}' must be followed by a divider comment.`,
            });
        }
    }
}

/**
 * Returns true if the given node falls within the section range.
 */
function inRange(node, range) {
    if (!range || !node.range) return false;
    return node.range[0] >= range[0] && node.range[0] < range[1];
}

module.exports = { findSectionRange, validateSectionHeader, inRange };
