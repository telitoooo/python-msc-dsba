### Les frameworks web

Les outils de la bibliothèque standard pour écrire un serveur (`http.server`) sont peu pratiques. Des paquets externes fournissent des **frameworks web** : Django, Pyramid, CherryPy, Bottle, **Flask**, Tornado, Web2Py…

Ils aident surtout à définir des **gestionnaires** (*handlers*) : des fonctions (ou classes) qui construisent la réponse HTTP à une requête arrivant sur une **route** (un chemin) donnée. Un gestionnaire renvoie la chaîne qui formera le **corps** de la réponse :

- pour un serveur web, le **HTML** de la page, souvent produit à partir d'un **gabarit** (*template*) : un fichier HTML générique contenant des symboles remplacés par des valeurs à chaque requête ;
- pour un serveur d'API, les **données sérialisées** (JSON).

### Flask : un micro-framework

```python norun
# app.py
import flask

app = flask.Flask(__name__)       # application nommée d'après le module courant


@app.route("/")                   # un DÉCORATEUR : cette fonction gère le chemin « / »
def index():
    return "Hello world!"         # le corps de la réponse HTTP


if __name__ == "__main__":
    app.run(port=5000)            # le serveur écoute sur le port 5000
```

On le lance par `python3 app.py`, puis on ouvre <http://127.0.0.1:5000> (ou <http://localhost:5000>) : le serveur tourne sur **notre** ordinateur.

> 💡 `@app.route("/")` est un **décorateur** (module 10) : il enregistre la fonction `index` comme gestionnaire de la route `/`.

> ⚠️ **Dans ce site**, Flask est installé depuis PyPI au premier `import flask` (connexion internet requise), mais aucun serveur ne peut ouvrir de port : `app.run()` est simulé. On teste donc l'application avec son **client de test**, `app.test_client()`, qui envoie de vraies requêtes HTTP à l'application… sans réseau. C'est d'ailleurs ainsi qu'on écrit les tests automatiques d'une application Flask.

```python
import flask

app = flask.Flask(__name__)


@app.route("/")
def index():
    return "Hello world!"


@app.route("/custom/<name>")      # <name> : partie variable du chemin, passée en paramètre
def custom(name):
    return "Hello {}".format(name)


@app.route("/square/<int:n>")     # <int:n> : convertie en entier (sinon : 404)
def square(n):
    return flask.jsonify({"n": n, "square": n * n})   # réponse JSON


client = app.test_client()
for path in ["/", "/custom/Ada", "/square/12", "/square/abc", "/nowhere"]:
    response = client.get(path)
    print(path, "→", response.status_code, response.get_data(as_text=True).strip()[:45])

if __name__ == "__main__":
    app.run(port=5000)
```

### Les gabarits (*templates*) avec Jinja2

Flask cherche les gabarits dans un dossier `templates/` à côté de l'application. `render_template("hello.html", person=name)` remplit le gabarit avec les variables données : `{{ person }}` affiche une valeur, `{% for … %}` / `{% if … %}` contrôlent la structure.

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
<ul>{% for item, price in stock.items() %}<li>{{ item }} : {{ "%.2f"|format(price) }}</li>{% endfor %}</ul>"""


@app.route("/custom/<name>")
def custom(name):
    # avec un fichier : flask.render_template("hello.html", person=name, stock=…)
    return flask.render_template_string(PAGE, person=name, stock={"candy": 0.5, "cake": 2.0})


print(app.test_client().get("/custom/Ada").get_data(as_text=True))
```

### Formulaires, redirections et codes d'erreur

```python
import flask

app = flask.Flask(__name__)
stock = {"candy": 2, "cake": 0}


@app.route("/")
def index():
    return flask.jsonify(stock)


@app.route("/buy", methods=["POST"])            # n'accepte que les requêtes POST
def buy():
    item = flask.request.form.get("item")       # données envoyées par un formulaire
    if item not in stock:
        return f"unknown item: {item}", 404     # (corps, code de statut)
    if stock[item] == 0:
        return f"{item} is sold out", 409
    stock[item] -= 1
    return flask.redirect("/")                  # 302 : le navigateur recharge la page d'accueil


client = app.test_client()
print(client.post("/buy", data={"item": "candy"}).status_code)   # 302
print(client.post("/buy", data={"item": "cake"}).status_code)    # 409
print(client.get("/buy").status_code)                            # 405 : GET non autorisé
print(client.get("/").get_json())
```

> 💡 `flask.request.args` contient les paramètres de la *query* (`/search?q=…`), `flask.request.form` les champs d'un formulaire envoyé en `POST`, `flask.request.get_json()` un corps JSON.

> 🎯 **À retenir** : un framework associe des **routes** à des **gestionnaires** ; `app = flask.Flask(__name__)`, `@app.route("/chemin/<param>")`, `methods=["POST"]` ; on renvoie du texte, `jsonify(…)`, `render_template(…)`, `redirect(…)` ou `(corps, code)` ; gabarits Jinja2 avec `{{ … }}` et `{% … %}` ; `app.run(port=5000)` sur `localhost` ; `app.test_client()` pour tester.
