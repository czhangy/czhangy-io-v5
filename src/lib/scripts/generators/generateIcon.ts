import fs from 'fs';
import path from 'path';
import {
    handleException,
    logSuccess,
    NOT_PASCAL_CASE,
    validateRootDirectory,
    writeToFile,
} from '@/lib/scripts/utils/helpers';

const ICON_EXISTS = 'That icon already exists.';
const DOESNT_END_WITH_ICON = "Icon components must end with 'Icon'.";
const USAGE = 'Usage: npm run gen:icon <IconName>';

interface IconArgs {
    icon: string;
}

const parseArgs = (argv: string[]): IconArgs => {
    const [icon] = argv;
    if (!icon) {
        throw new Error(USAGE);
    }
    return { icon };
};

const getPath = (args: IconArgs): string =>
    path.join('src', 'lib', 'icons', `${args.icon}.tsx`);

const validateArgs = (args: IconArgs): void => {
    if (!/^[A-Z]/.test(args.icon)) {
        throw new Error(NOT_PASCAL_CASE);
    }
    if (!args.icon.endsWith('Icon')) {
        throw new Error(DOESNT_END_WITH_ICON);
    }
    if (fs.existsSync(getPath(args))) {
        throw new Error(ICON_EXISTS);
    }
};

const createIcon = (args: IconArgs): void => {
    const filePath = getPath(args);

    writeToFile(filePath, [
        `const ${args.icon}: React.FC = () => {\n`,
        '\treturn <svg></svg>;\n',
        '};\n',
        '\n',
        `export default ${args.icon};\n`,
    ]);

    logSuccess(`${args.icon} was created successfully!`);
};

const main = (): void => {
    try {
        validateRootDirectory();
        const args = parseArgs(process.argv.slice(2));
        validateArgs(args);
        createIcon(args);
    } catch (error) {
        handleException(error);
    }
};

main();
