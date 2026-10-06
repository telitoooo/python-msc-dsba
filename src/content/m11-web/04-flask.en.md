### Web frameworks

The standard library's tools for writing a server (`http.server`) are not very user-friendly. External packages provide **web frameworks**: Django, Pyramid, CherryPy, Bottle, **Flask**, Tornado, Web2Py…

They mainly help define **handlers**: functions (or classes) that build the HTTP response to a request arriving on a given **route** (a path). A handler returns the string that becomes the **body** of the response:

- for a web server, the **HTML** of the page, often produced from a **template**: a generic HTML file containing symbols replaced by values for each request;
- for an API server, the **serialized data** (JSON).

### Flask: a micro web framework

```python norun
# app.py
import flask

app = flask.Flask(__name__)       # application named after the current module


@app.route("/")                   # a DECORATOR: this function handles the path "/"
def index():
    return "Hello world!"         # the body of the HTTP response


if __name__ == "__main__":
    app.run(port=5000)            # the server listens on port 5000
```

Run it with `python3 app.py`, then open <http://127.0.0.1:5000> (or <http://localhost:5000>): the server runs on **our** computer.

> 💡 `@app.route("/")` is a **decorator** (module 10): it registers the `index` function as the handler of the `/` route.

> ⚠️ **On this site**, Flask is installed from PyPI on the first `import flask` (internet connection required), but no server can open a port: `app.run()` is simulated. We therefore test the application with its **test client**, `app.test_client()`, which sends real HTTP requests to the application… without any network. This is actually how automated tests of a Flask application are written.

```python
import flask

app = flask.Flask(__name__)


@app.route("/")
def index():
    return "Hello world!"


@app.route("/custom/<name>")      # <name>: variable part of the path, passed as a parameter
def custom(name):
    return "Hello {}".format(name)


@app.route("/square/<int:n>")     # <int:n>: converted to an integer (otherwise: 404)
def square(n):
    return flask.jsonify({"n": n, "square": n * n})   # JSON response


client = app.test_client()
for path in ["/", "/custom/Ada", "/square/12", "/square/abc", "/nowhere"]:
    response = client.get(path)
    print(path, "→", response.status_code, response.get_data(as_text=True).strip()[:45])

if __name__ == "__main__":
    app.run(port=5000)
```

### Templates with Jinja2

Flask looks for templates in a `templates/` folder next to the application. `render_template("hello.html", person=name)` fills the template with the given variables: `{{ person }}` displays a value, `{% for … %}` / `{% if … %}` control the structure.

```text
templates/hello.html
<html>
  <head><title>My greeting web server</title></head>
  <body>
    <h1>Welcome {{ person }}</h1>
    <p>You are very welcome on this empty page. Enjoy!</p>
  </body>
</html>
```

```python
import flask

app = flask.Flask(__name__, template_folder="templates/")

PAGE = """<h1>Welcome {{ person }}</h1>
<ul>{% for item, price in stock.items() %}<li>{{ item }}: {{ "%.2f"|format(price) }}</li>{% endfor %}</ul>"""


@app.route("/custom/<name>")
def custom(name):
    # with a file: flask.render_template("hello.html", person=name, stock=…)
    return flask.render_template_string(PAGE, person=name, stock={"candy": 0.5, "cake": 2.0})


print(app.test_client().get("/custom/Ada").get_data(as_text=True))
```

### Forms, redirections and error codes

```python
import flask

app = flask.Flask(__name__)
stock = {"candy": 2, "cake": 0}


@app.route("/")
def index():
    return flask.jsonify(stock)


@app.route("/buy", methods=["POST"])            # only accepts POST requests
def buy():
    item = flask.request.form.get("item")       # data sent by a form
    if item not in stock:
        return f"unknown item: {item}", 404     # (body, status code)
    if stock[item] == 0:
        return f"{item} is sold out", 409
    stock[item] -= 1
    return flask.redirect("/")                  # 302: the browser reloads the home page


client = app.test_client()
print(client.post("/buy", data={"item": "candy"}).status_code)   # 302
print(client.post("/buy", data={"item": "cake"}).status_code)    # 409
print(client.get("/buy").status_code)                            # 405: GET not allowed
print(client.get("/").get_json())
```

> 💡 `flask.request.args` holds the *query* parameters (`/search?q=…`), `flask.request.form` the fields of a form sent with `POST`, `flask.request.get_json()` a JSON body.

> 🎯 **Key points**: a framework maps **routes** to **handlers**; `app = flask.Flask(__name__)`, `@app.route("/path/<param>")`, `methods=["POST"]`; return text, `jsonify(…)`, `render_template(…)`, `redirect(…)` or `(body, code)`; Jinja2 templates with `{{ … }}` and `{% … %}`; `app.run(port=5000)` on `localhost`; `app.test_client()` to test.
