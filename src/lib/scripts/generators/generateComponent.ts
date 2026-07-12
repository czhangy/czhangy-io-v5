import fs from 'fs';
import path from 'path';
import {
    DIVIDER_STRING,
    handleException,
    logSuccess,
    SUBDIRECTORY_DOESNT_EXIST,
    toKebabCase,
    validateRootDirectory,
    writeToFile,
} from '@/lib/scripts/utils/helpers';

const COMPONENT_EXISTS = 'That component already exists.';
const USAGE = 'Usage: npm run gen:component <subdirectory> <ComponentName>';

interface ComponentArgs {
    subdir: string;
    component: string;
}

const parseArgs = (argv: string[]): ComponentArgs => {
    const [subdir, component] = argv;
    if (!subdir || !component) {
        throw new Error(USAGE);
    }
    return { subdir, component };
};

const getPaths = (args: ComponentArgs) => {
    const subdirPath = path.join('src', 'components', args.subdir);
    const componentPath = path.join(subdirPath, args.component);
    return { subdirPath, componentPath };
};

const validateArgs = (args: ComponentArgs): void => {
    const { subdirPath, componentPath } = getPaths(args);
    if (!fs.existsSync(subdirPath) || !fs.statSync(subdirPath).isDirectory()) {
        throw new Error(SUBDIRECTORY_DOESNT_EXIST);
    }
    if (fs.existsSync(componentPath)) {
        throw new Error(COMPONENT_EXISTS);
    }
};

const createTsx = (componentPath: string, component: string): void => {
    const kebabComponent = toKebabCase(component);
    const filePath = path.join(componentPath, `${component}.tsx`);
    const classNameAccess = kebabComponent.includes('-')
        ? `styles['${kebabComponent}']`
        : `styles.${kebabComponent}`;

    writeToFile(filePath, [
        `import styles from './${component}.module.scss';\n`,
        '\n',
        `const ${component}: React.FC = () => {\n`,
        DIVIDER_STRING,
        '\t// MARKUP\n',
        DIVIDER_STRING,
        '\n',
        `\treturn <div className={${classNameAccess}}></div>;\n`,
        '};\n',
        '\n',
        `export default ${component};\n`,
    ]);
};

const createScss = (componentPath: string, component: string): void => {
    const filePath = path.join(componentPath, `${component}.module.scss`);

    writeToFile(filePath, [
        "@use '@/styles/constants' as *;\n",
        "@use '@/styles/mixins' as *;\n",
        '\n',
        `.${toKebabCase(component)} {\n`,
        '}\n',
    ]);
};

const createMd = (componentPath: string, component: string): void => {
    const filePath = path.join(componentPath, `${component}.md`);
    writeToFile(filePath, [`# ${component}\n`]);
};

const createComponent = (args: ComponentArgs): void => {
    const { componentPath } = getPaths(args);

    fs.mkdirSync(componentPath, { recursive: true });

    createTsx(componentPath, args.component);
    createScss(componentPath, args.component);
    createMd(componentPath, args.component);

    logSuccess(`${args.component} was created successfully!`);
};

const main = (): void => {
    try {
        validateRootDirectory();
        const args = parseArgs(process.argv.slice(2));
        validateArgs(args);
        createComponent(args);
    } catch (error) {
        handleException(error);
    }
};

main();
