import fs from 'fs';
import path from 'path';

const ANSI_RED = '\x1b[31m';
const ANSI_GREEN = '\x1b[32m';
const ANSI_RESET = '\x1b[0m';

const PROJECT_NAME = 'czhangy-io';

export const DIVIDER_STRING =
    '\t// -------------------------------------------------------------------------\n';

export const WRONG_DIRECTORY =
    'This script must be run from the project root directory.';
export const SUBDIRECTORY_DOESNT_EXIST = "That subdirectory doesn't exist.";
export const NOT_PASCAL_CASE = 'Names must be defined in PascalCase.';

export const logSuccess = (message: string): void => {
    console.log(`${ANSI_GREEN}${message}${ANSI_RESET}`);
};

export const handleException = (error: unknown): never => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n${ANSI_RED}${message}${ANSI_RESET}`);
    process.exit(1);
};

export const validateRootDirectory = (): void => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    try {
        const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf-8')
        );
        if (packageJson.name !== PROJECT_NAME) {
            throw new Error(WRONG_DIRECTORY);
        }
    } catch {
        throw new Error(WRONG_DIRECTORY);
    }
};

// https://stackoverflow.com/questions/1175208/elegant-python-function-to-convert-camelcase-to-snake-case
export const toKebabCase = (name: string): string =>
    name
        .replace(/(.)([A-Z][a-z]+)/g, '$1-$2')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();

export const writeToFile = (filePath: string, lines: string[]): void => {
    fs.writeFileSync(filePath, lines.join(''));
};
