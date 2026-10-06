### What is a programming language?

A processor (CPU) understands neither French nor English: it only knows **machine code**, a purely numerical sequence of very elementary instructions (read / write a byte in memory, arithmetic and logical operations, tests and jumps). Unreadable for a human!

A **programming language** is an intermediate: you write readable instructions, which are then turned into machine code by:

- a **compiler**, which translates the whole program **before** running it (C, C++, Rust, Go…);
- an **interpreter**, which reads and runs the program **step by step** (Python, JavaScript, R…).

There are hundreds of languages (C, C++, Java, C#, JavaScript, Ruby, Rust, Haskell, Go, Fortran, OCaml, Swift, Kotlin, R, Scala…), with different syntax and semantics rules, and various “types”: compiled, interpreted, object-oriented, imperative, functional, concurrent…

### Python in a nutshell

| Year | Milestone |
|---|---|
| 1989 | Guido van Rossum (Netherlands) creates Python as an internal scripting language |
| 1991 | first public release (0.9.0) |
| 2000 / 2001 | Python 2.0; creation of the Python Software Foundation |
| 2008 | Python 3.0 (not compatible with Python 2) |
| 2021… | Python 3.10, 3.11…: a new version every year (this site uses Python 3.14) |

Guido van Rossum was for a long time the language's “Benevolent Dictator For Life” (*BDFL*). Python is a **high-level, multi-paradigm** language:

- **interpreted** → slower than a compiled language, but very flexible;
- **garbage collected** → no manual memory management;
- **imperative**, **procedural**, **object-oriented** (module 7) and **functional** (module 10).

It is mainly (but not only) used for **data science**, **web services** and **scripting**, and tops the popularity rankings (TIOBE, PYPL).

### Where do I write code?

1. **In the interactive interpreter** (the Python console, `>>>` prompt): ideal to quickly test a line. Leave with `quit()`.
2. **In a `.py` file** written with a text editor, then run.
3. **In an IDE** (integrated development environment): IDLE (shipped with Python), Spyder, PyCharm, Visual Studio Code… For a big project, the IDE brings syntax highlighting, error detection (*linters*), code navigation, git integration…
4. **In a browser, with a Jupyter notebook** (or Google Colab): handy for data analysis prototypes.

```text
$ python hello.py              # runs the file as a SCRIPT
Hello World!
$ python -m hello              # runs the MODULE hello (looked up in Python's path)
Hello World!
$ python -c "print('hello')"   # runs a string of code directly
hello
```

> 💡 On this site, the editor plays the role of the `main.py` file and the **Run** button that of the command `python main.py`.

### Notebooks

Inspired by the Mathematica software, **notebooks** interleave code and explanations (text, maths, pictures). They contain two kinds of **cells**: **code** cells (Python, executable) and **text** cells (Markdown, static). The Jupyter application is actually a **web server** displayed in the browser (`pip install jupyter` then `jupyter notebook`).

### Libraries and `pip`

Python comes with a vast **standard library** (`math`, `random`, `os`, `json`, `datetime`…): you just need to **import** it. Many other packages (NumPy, pandas, matplotlib, scikit-learn…) live on **PyPI**, the *Python Package Index* (more than 500,000 packages), and are installed with **pip** (“*Pip Installs Packages*”, a recursive acronym).

```text
$ pip install numpy pandas            # depending on your setup: pip3
$ pip install -r requirements.txt     # installs all the dependencies of a project
```

A project lists its dependencies, with their versions, in a `requirements.txt` file:

```text
matplotlib==3.1.1
numpy==1.17.3
pandas==0.25.2
requests==2.19.1
```

> ⚠️ **`pip` is a terminal command, not a Python statement!** Writing `pip install numpy` in a program raises a `SyntaxError`. (On this site, the usual packages are already available: just import them.)

```python
import math, random              # two modules of the standard library

print(math.log2(10))
print(random.random())           # random number in [0, 1[
print(math.sqrt(16), math.pi)
```

### Finding help

The official documentation (docs.python.org), cheat sheets, *Python Notes for Professionals*, StackOverflow (lots of answers… you must learn to judge how solid they are), and assistants such as ChatGPT. In the interpreter, `help(obj)` prints the documentation (the *docstring*) of a module or a function.

### Syntax principles

- **No brackets or delimiters**: blocks are marked by **colons** `:` and **indentation** (4 spaces).
- `#` starts a **comment** (until the end of the line).
- `"""…"""` right below a `def` is a **docstring**: the function's documentation, shown by `help()`.
- A statement that is too long can span several lines: preferably **inside parentheses**, otherwise with a backslash `\` at the end of the line.
- Strings are written between double or single quotes.

```python
# Single line comment
n = 10  # a comment can also end a line

def f(x):
    """
    Compute the value of f for parameter x
    """
    y = x
    if x < 0:
        y = -x
    return y

a = b = c = d = e = 1        # chained assignment: the same value for all
# a = a + b + c +            ← wrong: the line stops on an operator
#     d + e
a = (a + b + c +             # correct: inside parentheses
     d + e)
a = a + b + c + \
    d + e                    # also correct, with \
print(a, f(-3))
help(f)
```

### Anatomy of a Python program

A complete program usually chains: **imports**, documented function **definitions**, **error** handling (`try` / `except`, module 5) and an entry point protected by `if __name__ == "__main__":` (module 5), which only runs when the file itself is launched (not when it is imported). The first example of the course fetches the New York Times headlines: you will find it, commented, in lesson 11.3.

> 🎯 **Key points**: Python is an interpreted, multi-paradigm language created in 1989; you use it in the console, `.py` files, an IDE or notebooks; `python file.py`, `python -m module`, `python -c "code"`; `pip install` (in the terminal!) and `requirements.txt`; indentation + `:`, `#`, docstrings and `help()`.
