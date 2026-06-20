from termcolor import colored
import os
import re
import select
import sys
import termios
import tty

# Constants
ROOT = 'czhangy-io'
RED = 'red'
GREEN = 'green'
YELLOW = 'yellow'
LIGHT_CYAN = 'light_cyan'
LIGHT_MAGENTA = 'light_magenta'

# Keys
KEY_UP = '\x1b[A'
KEY_DOWN = '\x1b[B'
KEY_ENTER = '\r'
DIVIDER_STRING = f'\t// -------------------------------------------------------------------------\n'

# Errors
WRONG_DIRECTORY = 'This script must be run from the root directory.'
SUBDIRECTORY_DOESNT_EXIST = 'That subdirectory doesn\'t exist.'
NOT_PASCAL_CASE = 'Class names must be defined in PascalCase'


def handle_exception(e):
    print(f'\n{colored(e, RED)}')
    exit(1)


def _getch() -> str:
    """Read a single raw keypress. Returns the character, or the full ANSI sequence for special keys."""
    fd = sys.stdin.fileno()
    old = termios.tcgetattr(fd)
    try:
        tty.setraw(fd)
        ch = sys.stdin.buffer.read(1).decode('utf-8', errors='replace')
        if ch == '\x03':
            raise KeyboardInterrupt
        if ch == '\x1b':
            if select.select([sys.stdin], [], [], 0.05)[0]:
                ch += sys.stdin.buffer.read(1).decode('utf-8', errors='replace')
                if len(ch) == 2 and ch[1] == '[' and select.select([sys.stdin], [], [], 0.05)[0]:
                    ch += sys.stdin.buffer.read(1).decode('utf-8', errors='replace')
        return ch
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old)


def prompt_key(prompt: str):
    """Print prompt and read a single keypress. Returns the char or None on Escape."""
    print(colored(prompt, LIGHT_MAGENTA), end='', flush=True)
    ch = _getch()
    print()
    if ch == '\x1b':
        return None
    return ch


def prompt_input(prompt: str):
    """Print prompt and read a line with backspace support. Returns str or None on Escape."""
    print(colored(prompt, LIGHT_MAGENTA), end='', flush=True)
    buf = []
    while True:
        ch = _getch()
        if ch == '\x1b':
            print()
            return None
        if ch in ('\r', '\n'):
            print()
            return ''.join(buf)
        if ch in ('\x7f', '\x08'):
            if buf:
                buf.pop()
                print(f'\r\033[2K{colored(prompt, LIGHT_MAGENTA)}{"".join(buf)}', end='', flush=True)
        elif len(ch) == 1 and ch.isprintable():
            buf.append(ch)
            print(ch, end='', flush=True)


def collect_from_options(prompt: str, options: dict):
    while True:
        print(colored(prompt, LIGHT_MAGENTA), end='', flush=True)
        ch = _getch()
        print()
        clear_last_line()
        if ch == '\x1b':
            return None
        if len(ch) == 1 and ch.lower() in options:
            return options[ch.lower()]


def collect_from_options_or_exit(prompt: str, options: dict):
    return collect_from_options(prompt, options)


def move_up(n: int = 1):
    print(f'\033[{n}A', end='', flush=True)


def clear_line():
    print('\033[2K', end='', flush=True)


def clear_to_end():
    print('\033[J', end='', flush=True)


def clear_last_line():
    move_up()
    clear_line()


def validate_root_directory():
    current_dir = os.path.basename(os.getcwd())
    if current_dir != 'clashpedia':
        raise Exception(WRONG_DIRECTORY)


# https://stackoverflow.com/questions/1175208/elegant-python-function-to-convert-camelcase-to-snake-case
def to_kebab_case(component):
    name = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', component)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', name).lower()


def write_to_file(path, content):
    with open(path, 'w') as file:
        file.writelines(content)