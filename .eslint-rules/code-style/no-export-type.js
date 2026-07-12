/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Disallow "export type" outside of src/lib/static/types.ts.',
        },
        messages: {
            noExportType:
                '"export type" is only allowed in src/lib/static/types.ts.',
        },
        schema: [],
    },
    create(context) {
        const ALLOWED_SUFFIX = 'src/lib/static/types.ts';

        const check = (node) => {
            const normalizedFilename = context.filename.replace(/\\/g, '/');
            if (
                node.exportKind === 'type' &&
                !normalizedFilename.endsWith(ALLOWED_SUFFIX)
            ) {
                context.report({ node, messageId: 'noExportType' });
            }
        };

        return {
            ExportNamedDeclaration: check,
            ExportAllDeclaration: check,
        };
    },
};
