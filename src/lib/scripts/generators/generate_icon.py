import argparse
import sys
from termcolor import colored
from lib.scripts.utils.helpers import *

# Constants
ICON_EXISTS = 'That icon already exists.'
DOESNT_END_WITH_ICON = 'Icon components must end with \'Icon\'.'

def parse_args(args):
    parser = argparse.ArgumentParser(description='Create a new icon.')
    parser.add_argument('icon', metavar='ICON_NAME', type=str, nargs=1,
                        help='the name of the icon in PascalCase')
    return parser.parse_args(args)


def get_path(args):
    return f'src/lib/icons/{args.icon[0]}.tsx'


def validate_args(args):
    icon_name = args.icon[0]
    if not icon_name[0].isupper():
        raise Exception(NOT_PASCAL_CASE)
    if not icon_name.endswith('Icon'):
        raise Exception(DOESNT_END_WITH_ICON)

    if os.path.isfile(get_path(args)):
        raise Exception(ICON_EXISTS)


def create_icon(args):
    icon_name = args.icon[0]
    file_path = get_path(args)

    file_contents = [
        f'const {icon_name}: React.FC = () => {{\n',
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
