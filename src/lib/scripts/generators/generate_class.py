from lib.scripts.utils.helpers import *
import argparse
import sys

# Constants
CLASS_EXISTS = 'That class already exists.'

def parse_args(args):
    # Define + use parser
    parser = argparse.ArgumentParser(description='Create a new class.')

    parser.add_argument('klass', metavar='CLASS_NAME', type=str, nargs=1,
                        help='the name of the class in PascalCase')
    return parser.parse_args(args)


def get_path(args):
    return f'src/lib/utils/{args.klass[0]}.ts'


def validate_args(args):
    # Check for case
    if not args.klass[0][0].isupper():
        raise Exception(NOT_PASCAL_CASE)

    # Check for existing paths
    class_path = get_path(args)
    if os.path.isfile(class_path):
        raise Exception(CLASS_EXISTS)


def create_class(args):
    file_path = get_path(args)

    file_contents = [
        '/**\n',
        ' * Document me!\n',
        ' */\n'
        f'export default class {args.klass[0]} {{\n',
        DIVIDER_STRING,
        f'\t// HELPER METHODS\n',
        DIVIDER_STRING,
        '}',
    ]

    write_to_file(file_path, file_contents)
    print(colored(f'{args.klass[0]} was created successfully!', GREEN))


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

    create_class(args)


if __name__ == '__main__':
    new()