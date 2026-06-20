import argparse
import sys
from termcolor import colored
from lib.scripts.utils.helpers import *

# Constants
ICON_EXISTS = 'That icon already exists.'
DOESNT_END_WITH_ICON = 'Icon components must end with \'Icon\'.'

def parse_args(args):
    # Define + use parser
    parser = argparse.ArgumentParser(description='Create a new icon.')
    parser.add_argument('subdir', metavar='SUBDIRECTORY_NAME', type=str, nargs=1,
                        help='the subdirectory of the class relative to src/components/icons/')
    parser.add_argument('icon', metavar='ICON_NAME', type=str, nargs=1,
                        help='the name of the icon in PascalCase')
    return parser.parse_args(args)


def get_paths(args):
    subdir_path = f'src/components/icons/{args.subdir[0]}'
    icon_path = f'{subdir_path}/{args.icon[0]}.tsx'
    return (subdir_path, icon_path)



def validate_args(args):
    # Check for naming
    icon_name = args.icon[0]
    if not icon_name[0].isupper():
        raise Exception(NOT_PASCAL_CASE)
    if not icon_name.endswith('Icon'):
        raise Exception(DOESNT_END_WITH_ICON)

    # Check for existing path
    subdir_path, icon_path = get_paths(args)
    if not os.path.isdir(subdir_path):
        raise Exception(SUBDIRECTORY_DOESNT_EXIST)
    if os.path.isfile(icon_path):
        raise Exception(ICON_EXISTS)


def create_icon(args):
    icon_name = args.icon[0]
    _, file_path = get_paths(args)

    file_contents = [
        f'const {icon_name}: React.FC = () => {{\n',
        DIVIDER_STRING,
        f'\t// MARKUP\n',
        DIVIDER_STRING,
        '\n',
        f'\treturn ;\n',
        f'}};\n',
        '\n',
        f'export default {icon_name};\n'
    ]

    write_to_file(file_path, file_contents)
    print(colored(f'{icon_name} was created successfully!', GREEN))


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

    create_icon(args)


if __name__ == '__main__':
    new()