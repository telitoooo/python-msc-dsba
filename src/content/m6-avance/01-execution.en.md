### What happens inside the computer

- The **processor (CPU)** executes elementary instructions: calculations, comparisons, moves in memory.
- The **main memory (RAM)** is fast but temporary: it holds the running programs and their data.
- The **disk** is slow but permanent: it stores the files, including the programs themselves.

On the disk, **files** are organised in a hierarchy of folders. Each one has a **path** (a simple string, e.g. `/usr/bin/python3`), properties (size, owner) and data: a sequence of bits. A **text** file is human-readable (bits are grouped into bytes encoding characters); a **binary** file (image, video, Word document…) can only be read by the programs that know its format.

A **program** is a binary file too: instructions in machine code. To run it, it is copied from the disk to RAM, from where it sends its instructions to the CPU. Your Python code, on the other hand, is a simple **text file** (any editor will do to write it): it is executed by another program, **the interpreter** `python3`, usually stored in `/usr/bin/` or in a folder listed in the `PATH` environment variable.

The **terminal** (console, shell) and the **file browser** are two views of the same file system: you navigate through folders, create, move and open files, and run programs. Even a web browser can navigate your files, for example thanks to the small web server built into Python:

```text
$ python3 -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
::1 - - [12/Sep/2026 11:02:59] "GET / HTTP/1.1" 200 -
```

(then open `http://localhost:8000` in the browser to see the content of the current folder).

The interpreter accepts as an argument a file path, a module, or directly a string of code:

```text
python3 /home/ada/hello.py      # full path of a script
python3 hello.py                # script in the current folder
python3 -m hello                # run a module
python3 -c "print('hello')"     # run a string of code
```

### The interpreter reads your code line by line

```python
import math                 # 1. loads the math module and binds the name "math"

print("hey")                # 2. prints immediately

def affine(x, a, b=0):      # 3. DEFINES the function: its body is not executed
    print("  computing affine")
    return a * x + b

x = math.sqrt(7)            # 4. creates the variable x
y = affine(x, 4, 3)         # 5. only now is the body of affine executed
print("y value is", y)      # 6.
```

> 💡 To **see** the execution step by step (variables, call frames, objects), paste this code into [Python Tutor](https://pythontutor.com): it is the ideal tool for the following lessons.

### Keywords and built-in functions

**Keywords** are part of the syntax: they cannot be reassigned. Here they all are:

```text
False   None    True    and     as      assert  async   await   break   class
continue        def     del     elif    else    except  finally for     from
global  if      import  in      is      lambda  nonlocal        not     or
pass    raise   return  try     while   with    yield
```

```python
import keyword
print(len(keyword.kwlist), keyword.iskeyword("lambda"), keyword.iskeyword("print"))
```

**Built-in functions and types** (`int`, `float`, `str`, `list`, `dict`, `set`, `tuple`, `print`, `range`, `len`, `sorted`, `sum`…) are not keywords, but simple names known by Python… which you therefore **can** overwrite by mistake:

```python raises=TypeError
print(sum([1, 2, 3]))   # 6
sum = 0                 # legal: "sum" now designates an integer!
for n in [1, 2, 3]:
    sum += n
print(sum)              # 6
print(sum([4, 5]))      # TypeError: 'int' object is not callable
```

> ⚠️ Never name a variable `list`, `dict`, `str`, `sum`, `max`, `min`, `input` or `print`: you would hide the built-in function for the rest of the program. Prefer `total`, `values`, `maximum`…

### Functions are values like any other

In Python, a function is an **object**: you can store it in a variable, a list or a dictionary, **pass it as an argument** and **return it**. Functions are said to be *first-class citizens*.

```python
def square(x):
    return x * x

f = square                      # no parentheses: we designate the function
print(f(5), f.__name__)

def apply(function, values):
    return [function(v) for v in values]

print(apply(square, [1, 2, 3]))
print(apply(abs, [-4, 2, -1]))
print(sorted(["Ada", "alan", "Grace"], key=str.lower))   # a function as an argument!
```

### Anonymous functions: `lambda`

`lambda parameters: expression` creates a small nameless function, handy for a one-off use:

```python
double = lambda x: 2 * x          # equivalent to: def double(x): return 2 * x
print(double(21))

operations = {
    "+": lambda a, b: a + b,
    "*": lambda a, b: a * b,
}
print(operations["*"](6, 7))

students = [("Ada", 17), ("Alan", 14), ("Grace", 19)]
print(max(students, key=lambda s: s[1]))
```

> 🎯 **Key points**: the interpreter runs the file from top to bottom; `def` only **defines**; built-ins can be overwritten, keywords cannot; a function is a value that can be passed, stored and returned.
