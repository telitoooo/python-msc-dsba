### Files, folders and paths

Files are stored in a **tree of folders** starting from a root: `/` on macOS and Linux, `C:\` on Windows. To designate a file, you use a **path**:

- **absolute**: from the root, e.g. `/home/ada/course/notes.txt`;
- **relative**: from the **current working directory**, e.g. `notes.txt` or `data/sales.csv`. `.` designates the current folder and `..` the parent folder.

> 💡 **On this site**, each run starts in a fresh folder, `/home/pyodide/projet`, which contains `main.py` (your code) and any files provided by the exercise. Below the terminal, the **Working directory** panel shows the files your program has created or modified.

### Opening a file: `open()` and `with`

`open(path, mode, encoding=...)` returns a **file object**. The `with` block **closes it automatically** at the end, even if an error occurs: this is the preferred form.

```python
with open("shopping.txt", "w", encoding="utf-8") as f:
    f.write("bread\n")
    f.write("milk\n")

with open("shopping.txt", "r", encoding="utf-8") as f:
    content = f.read()

print(content)
print(repr(content))   # repr shows the hidden \n
```

Without `with`, you have to remember to close the file yourself: `f = open(...)` … `f.close()`. A badly closed file may lose the last data written.

### Opening modes

| Mode | Effect |
|---|---|
| `"r"` | read (default mode); `FileNotFoundError` if the file does not exist |
| `"w"` | write: creates the file, or **overwrites** it if it exists |
| `"a"` | append at the end; creates the file if needed |
| `"x"` | exclusive creation; error if the file already exists |
| `"b"` | to combine for binary files: `"rb"`, `"wb"` (images, pickle…) |

> ⚠️ **Always specify `encoding="utf-8"`** for text files. Otherwise, the default encoding depends on the system (especially on Windows) and accented characters may be corrupted.

### Reading a file

| Method | Result |
|---|---|
| `f.read()` | the whole content in a single string |
| `f.readline()` | the next line (with its `\n`) |
| `f.readlines()` | the list of all the lines |
| `for line in f:` | line by line, without loading everything into memory |

```python
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("monday;12\ntuesday;15\nwednesday;9\n")

total = 0
with open("log.txt", encoding="utf-8") as f:
    for line in f:                        # each line ends with "\n"
        day, value = line.strip().split(";")
        total += int(value)
        print(f"{day:<9} {value:>3}")
print("Total:", total)
```

> ⚠️ Each line read **keeps its final `\n`**: clean it with `strip()` before splitting it, and watch out for empty lines at the end of the file.

### Writing to a file

`write()` writes a string **without adding a line break**: add the `\n` yourself. You can also use `print(..., file=f)`.

```python
grades = {"Ada": 17, "Alan": 14}

with open("grades.csv", "w", encoding="utf-8") as f:
    f.write("name;grade\n")
    for name, grade in grades.items():
        f.write(f"{name};{grade}\n")

with open("grades.csv", "a", encoding="utf-8") as f:   # "a": append at the end
    print("Grace", 19, sep=";", file=f)

with open("grades.csv", encoding="utf-8") as f:
    print(f.read())
```

> 🎯 **Key points**: `with open(path, mode, encoding="utf-8") as f:`; `"r"` reads, `"w"` overwrites, `"a"` appends; `for line in f` + `strip()` to read cleanly; `write` does not add `\n`.
