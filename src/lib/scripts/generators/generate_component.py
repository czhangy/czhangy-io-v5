import argparse
import sys
from termcolor import colored
from lib.scripts.utils.helpers import *

# Constants
COMPONENT_EXISTS = 'That component already exists.'

def parse_args(args):
    # Define + use parser
    parser = argparse.ArgumentParser(description='Create a new component.')
    parser.add_argument('subdir', metavar='SUBDIRECTORY_NAME', type=str, nargs=1,
                        help='the subdirectory of the component')
    parser.add_argument('component', metavar='COMPONENT_NAME', type=str, nargs=1,
                        help='the name of the component in PascalCase')
    return parser.parse_args(args)


def get_paths(args):
    subdir_path = f'src/components/{args.subdir[0]}'
    component_path = subdir_path + '/' + args.component[0]
    return (subdir_path, component_path)


def validate_args(args):
    # Check for existing paths
    subdir_path, component_path = get_paths(args)
    if not os.path.isdir(subdir_path):
        raise Exception(SUBDIRECTORY_DOESNT_EXIST)
    if os.path.isdir(component_path):
        raise Exception(COMPONENT_EXISTS)


def create_tsx(path, component):
    kebab_component = to_kebab_case(component)
    file_path = f'{path}/{component}.tsx'
    file_contents = [
        f'import styles from "./{component}.module.scss";\n',
        '\n',
        f'const {component}: React.FC = () => {{\n',
        DIVIDER_STRING,
        f'\t// MARKUP\n',
        DIVIDER_STRING,
        '\n',
        f'\treturn <div className={{styles["{kebab_component}"]}}></div>;\n',
        f'}};\n',
        '\n',
        f'export default {component};\n'
    ]

    # Handle single-word components
    if '-' not in kebab_component:
        idx = file_contents.index(f'\treturn <div className={{styles["{kebab_component}"]}}></div>;\n')
        file_contents[idx] = f'\treturn <div className={{styles.{kebab_component}}}></div>;\n'

    write_to_file(file_path, file_contents)


def create_scss(path, component):
    file_path = f'{path}/{component}.module.scss'
    file_contents = [
        '@use "@/styles/common" as *;\n',
        '\n',
        f'.{to_kebab_case(component)} {{\n',
        '\n',
        '}\n'
    ]

    write_to_file(file_path, file_contents)


def create_md(path, component):
    file_path = f'{path}/{component}.md'
    write_to_file(file_path, [])


def create_component(args):
    _, component_path = get_paths(args)

    # Create component folder
    os.makedirs(component_path)

    # Create files
    create_tsx(component_path, args.component[0])
    create_scss(component_path, args.component[0])
    create_md(component_path, args.component[0])

    print(colored(f'{args.component[0]} was created successfully!', GREEN))


def new():
    try:
        validate_root_directory()
    except Exception as e:
        handle_exception(e)
    
    args = parse_args(sys.argv[1:])

    try:
        validate_args(args)
    except Exception as e:
        handle_exception(e)

    create_component(args)


if __name__ == '__main__':
    new()