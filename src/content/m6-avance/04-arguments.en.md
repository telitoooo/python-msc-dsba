### The mutable default argument trap

A default value is evaluated **only once**, when the `def` statement runs, and not at each call. If this value is mutable, all the calls that use it **share the same object**:

```python
def add_item(item, basket=[]):          # [] created ONCE, at definition time
    basket.append(item)
    return basket

print(add_item("apple"))   # ['apple']
print(add_item("pear"))    # ['apple', 'pear']  ← same list!
print(add_item.__defaults__)
```

The solution: use `None` as the default value, and create the object in the body of the function.

```python
def add_item(item, basket=None):
    if basket is None:
        basket = []                # a fresh list at each call
    basket.append(item)
    return basket

print(add_item("apple"), add_item("pear"))
```

> ⚠️ **Rule**: never use a list, a dictionary or a set as a default value. Use `None`.

### Variable number of arguments: `*args` and `**kwargs`

- `*args` gathers the extra **positional** arguments into a **tuple**;
- `**kwargs` gathers the extra **keyword** arguments into a **dictionary**.

```python
def log(level, *messages, **context):
    print(f"[{level}]", " ".join(messages), context)

log("INFO", "starting", "the", "server", port=8000, debug=True)
```

### Keyword-only arguments

Parameters placed **after** `*args` (or after a lone star `*`) can only be passed **by name**. This is ideal for options, which become explicit at the call:

```python
def connect(host, *, port=443, encrypted=True):
    return f"{host}:{port} (encrypted: {encrypted})"

print(connect("example.com", port=8080))
try:
    connect("example.com", 8080)           # port passed by position: refused
except TypeError as e:
    print("TypeError:", e)
```

### Unpacking a list or a dictionary at the call

At the **call**, `*` spreads a sequence into positional arguments and `**` spreads a dictionary into keyword arguments:

```python
def volume(length, width, height):
    return length * width * height

dimensions = [2, 3, 4]
print(volume(*dimensions))                 # volume(2, 3, 4)

sizes = {"height": 4, "length": 2, "width": 3}
print(volume(**sizes))                     # volume(length=2, width=3, height=4)

print(max(*[3, 9, 2]), "|", *["a", "b", "c"], sep=" ")
```

> 💡 **When should you use `*args`?** When the function really handles “as many values as you want” of the same kind (`max`, `print`, a sum…). Otherwise, explicit named parameters document better what the function expects: `*args` can then **hide** the interface.

> 🎯 **Key points**: mutable default value → `None`; `*args` = tuple, `**kwargs` = dictionary; parameters after `*` are keyword-only; `f(*list)` and `f(**dict)` unpack at the call.
