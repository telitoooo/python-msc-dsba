### The `os` module: talking to the system

```python
import os

print("Current folder:", os.getcwd())
os.makedirs("data/raw", exist_ok=True)           # creates the intermediate folders
with open("data/sales.csv", "w", encoding="utf-8") as f:
    f.write("jan;120\nfeb;95\n")

print(os.listdir("."))                            # content of a folder
print(os.listdir("data"))
os.chdir("data")                                  # change the current folder
print("Now in:", os.getcwd())
os.chdir("..")                                    # back to the parent folder
print(os.path.exists("data/sales.csv"), os.path.isdir("data"))
print(os.path.getsize("data/sales.csv"), "bytes")
```

`os.path` handles paths **as strings**:

| Function | Example → result |
|---|---|
| `os.path.join("data", "x.csv")` | `"data/x.csv"` (right separator for the system) |
| `os.path.basename("data/x.csv")` | `"x.csv"` |
| `os.path.dirname("data/x.csv")` | `"data"` |
| `os.path.splitext("x.csv")` | `("x", ".csv")` |
| `os.path.exists(p)`, `isfile(p)`, `isdir(p)` | existence tests |
| `os.path.getsize(p)`, `getmtime(p)` | size in bytes, modification date |

### `glob`: finding files by pattern

`glob.glob(pattern)` returns the list of matching paths: `*` stands for any sequence of characters, `?` for a single character, and `**` (with `recursive=True`) goes through all the subfolders.

```python
import glob, os

for name in ["a.py", "b.py", "notes.txt", "src/c.py", "src/tools/d.py"]:
    os.makedirs(os.path.dirname(name) or ".", exist_ok=True)
    open(name, "w").close()                      # creates an empty file

print(sorted(glob.glob("*.py")))                     # current folder only
print(sorted(glob.glob("**/*.py", recursive=True)))  # recursively
```

### `pathlib`: paths done right

The modern `pathlib` module represents a path by a **`Path` object**. The `/` operator joins the pieces, on every system.

```python
from pathlib import Path

here = Path(__file__).parent             # folder containing this script
data = here / "data" / "cities.txt"      # '/' joins paths
data.parent.mkdir(parents=True, exist_ok=True)
data.write_text("Paris\nLyon\n", encoding="utf-8")

print(data.exists(), data.name, data.stem, data.suffix)
print(data.read_text(encoding="utf-8").splitlines())
print(data.stat().st_size, "bytes")

for path in here.rglob("*.txt"):         # rglob = recursive search
    print(path.relative_to(here))
```

| `os.path` / `glob` | `pathlib` |
|---|---|
| `os.path.join(a, b)` | `Path(a) / b` |
| `os.path.exists(p)` | `p.exists()` |
| `os.path.basename(p)` | `p.name` |
| `os.path.splitext(p)[1]` | `p.suffix` |
| `os.listdir(d)` | `d.iterdir()` |
| `glob.glob("**/*.py", recursive=True)` | `d.rglob("*.py")` |
| `open(p).read()` | `p.read_text()` |

> 💡 Prefer `pathlib` to string concatenation: `"folder" + "/" + name` breaks on Windows, `Path("folder") / name` does not. `os.path` is still very common in existing code: both are interchangeable.

### Environment variables

Every program runs within an **environment**: a block of `key = value` pairs (`PATH`, `HOME`…), displayed in a terminal with the `env` command (or `set` on Windows). `PATH` lists the folders where the system looks for programs, such as `python3`. In Python, the environment is the `os.environ` dictionary:

```python
import os

for var in sorted(os.environ)[:5]:        # a few variables
    print(var, "=", os.environ[var])

print(os.environ.get("HOME"))
os.environ["MY_SETTING"] = "42"        # visible to this program and its subprocesses
print(os.environ["MY_SETTING"])

# Add a folder to PATH, then remove it (course example)
os.environ["PATH"] = os.environ.get("PATH", "/usr/bin") + ":/usr/local/bin"
print(os.environ["PATH"])
os.environ["PATH"] = os.environ["PATH"].replace(":/usr/local/bin", "")
print(os.environ["PATH"])
```

### The terminal (shell, command line)

Console, terminal, shell, command line: they all mean the same thing, a window where you type commands. The most useful ones, and their Python equivalent:

| Command | Effect | In Python |
|---|---|---|
| `ls` | list the files of the current folder | `os.listdir()` |
| `pwd` | print working directory | `os.getcwd()` |
| `cd folder` | change directory | `os.chdir(folder)` |
| `pushd` / `popd` | push / pop a directory (to come back to it later) | |
| `mkdir` / `rmdir` | create / remove a directory | `os.makedirs()` / `os.rmdir()` |
| `rm` | remove a file | `os.remove()` |
| `cat` | display the content of a file | `open(f).read()` |
| `file` | display the type of a file | |
| `wc` | count lines, words, characters (word count) | `len(text.split())` |
| `grep pattern f` | search a file for a pattern | `[l for l in f if pattern in l]` |

> 🎯 **Key points**: `os` for the system (current folder, listings, environment), `glob` to search by pattern, `pathlib.Path` to handle paths cleanly (`/`, `.name`, `.suffix`, `.rglob()`, `.read_text()`).
