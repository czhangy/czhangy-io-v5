import fs from 'fs';
import path from 'path';
import {
    DIVIDER_STRING,
    handleException,
    logSuccess,
    NOT_PASCAL_CASE,
    validateRootDirectory,
    writeToFile,
} from '@/lib/scripts/utils/helpers';

const CLASS_EXISTS = 'That class already exists.';
const DOESNT_END_WITH_HELPERS = "Utility classes must end with 'Helpers'.";
const USAGE = 'Usage: npm run gen:class <ClassName>';

interface ClassArgs {
    klass: string;
}

const parseArgs = (argv: string[]): ClassArgs => {
    const [klass] = argv;
    if (!klass) {
        throw new Error(USAGE);
    }
    return { klass };
};

const getPath = (args: ClassArgs): string =>
    path.join('src', 'lib', 'utils', `${args.klass}.ts`);

const validateArgs = (args: ClassArgs): void => {
    if (!/^[A-Z]/.test(args.klass)) {
        throw new Error(NOT_PASCAL_CASE);
    }
    if (!args.klass.endsWith('Helpers')) {
        throw new Error(DOESNT_END_WITH_HELPERS);
    }
    if (fs.existsSync(getPath(args))) {
        throw new Error(CLASS_EXISTS);
    }
};

const createClass = (args: ClassArgs): void => {
    const filePath = getPath(args);

    writeToFile(filePath, [
        `export default class ${args.klass} {\n`,
        DIVIDER_STRING,
        '\t// PRIVATE\n',
        DIVIDER_STRING,
        '\n',
        DIVIDER_STRING,
        '\t// PUBLIC\n',
        DIVIDER_STRING,
        '}\n',
    ]);

    logSuccess(`${args.klass} was created successfully!`);
};

const main = (): void => {
    try {
        validateRootDirectory();
        const args = parseArgs(process.argv.slice(2));
        validateArgs(args);
        createClass(args);
    } catch (error) {
        handleException(error);
    }
};

main();
