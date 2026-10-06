### Trois façons d'envoyer une requête HTTP

1. **Avec un navigateur** : taper une URL envoie une requête `GET` (un formulaire envoie souvent un `POST` avec ses données). Le navigateur fait la résolution DNS, ajoute le port selon le protocole et **affiche** la réponse.
2. **En ligne de commande** : `wget` et `curl` téléchargent une ressource sans l'afficher : ils renvoient le texte HTML brut. `curl` permet facilement d'envoyer des `POST` avec des données : pratique pour **tester un serveur**.

```text
$ wget https://github.com/tensorflow/tensorflow
Resolving github.com (github.com)... 140.82.118.3
Connecting to github.com (github.com)|140.82.118.3|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: 'tensorflow'

$ curl -X POST -d "item=candy" http://localhost:5000/buy
```

3. **En Python**, avec le paquet **`requests`** (à installer : `pip install requests`).

### Le paquet `requests`

```python norun
import requests

url = "https://en.wikipedia.org/wiki/Abraham_Lincoln"
resp = requests.get(url, timeout=10)
print("Response", resp.status_code)                       # 200
print("Size {:.2f}MB".format(len(resp.content) / 2**20))  # content : octets ; text : texte décodé
print(resp.headers["Content-Type"])
with open("lincoln.html", "w", encoding="utf-8") as fp:   # sauvegarder la page
    fp.write(resp.text)
```

| Élément | Rôle |
|---|---|
| `requests.get(url, params={…})` | requête GET ; `params` construit la *query* (`?q=…&page=…`) |
| `requests.post(url, data={…})` / `json={…}` | requête POST avec des données de formulaire / un corps JSON |
| `resp.status_code`, `resp.ok` | code de statut ; `ok` vaut `True` si le code est < 400 |
| `resp.text`, `resp.content` | corps de la réponse en texte / en octets |
| `resp.json()` | désérialise un corps JSON en objet Python (dict, liste…) |
| `resp.headers` | en-têtes de la réponse (dictionnaire) |
| `resp.raise_for_status()` | lève `requests.HTTPError` si le code est une erreur (4xx, 5xx) |
| `requests.get(url, stream=True)` + `resp.iter_content(…)` | recevoir un gros contenu morceau par morceau |

```python norun
import requests

resp = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
resp.raise_for_status()                    # stoppe ici en cas d'erreur 4xx / 5xx
repo = resp.json()                         # JSON → dictionnaire Python
print(repo["full_name"], repo["stargazers_count"])

resp = requests.post("https://httpbin.org/post", json={"item": "candy"}, timeout=10)
print(resp.status_code, resp.json()["json"])
```

### Anatomie d'un programme qui interroge le web

Le premier programme du cours (séance 1) récupère les titres du New York Times. Il combine `requests` et **BeautifulSoup** (`pip install requests beautifulsoup4`), qui analyse le HTML :

```python norun
import requests
from bs4 import BeautifulSoup


def get_nyt_headlines():
    url = "https://www.nytimes.com"
    try:
        response = requests.get(url)              # envoie une requête GET
        response.raise_for_status()
        # Analyse le HTML de la page avec BeautifulSoup
        soup = BeautifulSoup(response.content, "html.parser")
        # Trouve les éléments des titres (inspectez le code source de la page pour choisir)
        headlines = soup.find_all("h3")
        for index, headline in enumerate(headlines, start=1):
            print(f"{index}. {headline.text.strip()}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    get_nyt_headlines()
```

> ⚠️ **Dans le navigateur**, Python ne peut pas interroger librement n'importe quel site : par sécurité, les navigateurs bloquent les requêtes vers un autre site que celui de la page (politique **CORS**). Les exercices utilisent donc `fakeweb.py`, une imitation de `requests` avec **exactement la même interface** (`Session().get`, `.post`, `status_code`, `json()`, `raise_for_status()`…), qui répond à partir d'un petit Internet hors ligne. Sur votre ordinateur, remplacez simplement `fakeweb` par `requests`.

### Traiter une réponse JSON

Ce qui compte vraiment, c'est ce qu'on fait des données reçues :

```python
import json
from urllib.parse import urlencode

base = "https://api.vending.example/sales"
print(base + "?" + urlencode({"machine": "hall", "page": 2}))   # l'URL qu'enverrait params=…

body = '{"page": 2, "sales": [{"item": "candy", "price": 0.5}, {"item": "cake", "price": 2.0}]}'
data = json.loads(body)                                        # ce que fait resp.json()
total = sum(sale["price"] for sale in data["sales"])
print(f"page {data['page']} : {len(data['sales'])} ventes, total {total:.2f}")
```

> 🎯 **À retenir** : navigateur, `wget` / `curl` ou `requests` ; `requests.get(url, params=…)`, `requests.post(url, data=… / json=…)` ; `status_code`, `text`, `content`, `json()`, `headers`, `raise_for_status()` ; gérer `requests.exceptions.RequestException` ; BeautifulSoup pour analyser du HTML.
