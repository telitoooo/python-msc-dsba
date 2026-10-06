### Pourquoi le web ?

Au module 7, nous avons écrit une classe `VendingMachine`. Pour être vraiment utile, le programme du distributeur devrait **tourner en permanence** et être **accessible à distance** (consulter son état, ses ventes, commander un produit depuis un téléphone). Un programme qui ne s'arrête jamais et qu'on peut joindre par le réseau s'appelle un **serveur**. Sur Internet, c'est en général un **serveur HTTP**, qui suit un **protocole** précis :

- comment lui demander quelque chose : la **requête HTTP** ;
- ce qu'il renvoie : la **réponse HTTP**.

« Serveur » désigne à la fois l'ordinateur et le programme qui y tourne. En Python, on peut facilement **interroger** des serveurs (leçon 11.3) et en **écrire** (leçon 11.4).

### La vie d'une requête HTTP

Que se passe-t-il quand on tape `https://github.com/tensorflow/tensorflow` dans un navigateur ?

1. **Internet** est un immense réseau d'ordinateurs. Votre ordinateur n'y est pas directement relié : il passe par un **fournisseur d'accès** (FAI, *ISP*), lui-même connecté au réseau.
2. Chaque machine est identifiée par une **adresse IP** (par exemple `140.82.118.4`), comme une adresse postale.
3. L'**URL** indique le **protocole** (`https`), l'**hôte** (`github.com`) et la **ressource** demandée (`/tensorflow/tensorflow`) (détails en leçon 11.2).
4. **Résolution DNS** : on ne connaît que le *nom* `github.com`. Le FAI tient une table nom de domaine → adresse IP ; s'il ne connaît pas le nom, il interroge récursivement d'autres serveurs DNS.
5. **Port** : la machine `140.82.118.4` fait tourner plusieurs programmes serveurs (site web, API, mail, base de données…). Le **port** désigne celui à qui l'on parle ; les serveurs HTTPS écoutent sur le port **443**, HTTP sur le **80**.
6. Une **connexion TCP** est établie entre votre machine et `140.82.118.4:443`.
7. La **requête HTTP** est envoyée ; c'est simplement un **texte** :

```text
GET /tensorflow/tensorflow HTTP/1.1
Host: github.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml
Accept-Language: en-US,en;q=0.9,fr;q=0.8
Cookie: ...
```

La première ligne contient la **méthode** (`GET` pour lire, `POST` pour envoyer des données d'un formulaire, `PUT`, `DELETE`…), le **chemin** et la version du protocole ; suivent les **en-têtes** (*headers*), puis une ligne vide et éventuellement un **corps** (*body*).

8. Le serveur renvoie une **réponse HTTP**, elle aussi un texte : une ligne de **statut**, des en-têtes, une ligne vide, puis le contenu (ici le HTML de la page) :

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Date: Sun, 10 Nov 2019 23:30:20 GMT
Server: GitHub.com
Set-Cookie: user_session=...; path=/; secure; HttpOnly

<html>
  ...
</html>
```

9. Une grosse réponse (image, vidéo) est découpée en **paquets**, qui peuvent emprunter des routes différentes ; le client les **réassemble**.
10. Le navigateur **affiche** (*rendering*) le HTML. Il envoie d'autres requêtes pendant ce temps : images, feuilles de style, et requêtes **AJAX** (requêtes asynchrones lancées par le JavaScript de la page).

| Code de statut | Signification |
|---|---|
| `200 OK` | succès |
| `301` / `302` | redirection vers une autre adresse (en-tête `Location`) |
| `400 Bad Request` | requête mal formée |
| `403 Forbidden` / `404 Not Found` | accès interdit / ressource introuvable |
| `405 Method Not Allowed` | méthode non acceptée sur ce chemin |
| `500 Internal Server Error` / `503 Service Unavailable` | erreur / indisponibilité du serveur |

### Des données plutôt que des pages : la sérialisation

Un serveur d'**API** ne renvoie pas une page HTML mais des **données**… qui doivent pourtant voyager sous forme de texte. Transformer des données en texte s'appelle la **sérialisation** (module 5). **JSON** est le format le plus courant ; Python fournit aussi `pickle` (binaire, propre à Python).

```python
import json

machine = {"id": 3, "location": "hall", "items": {"candy": 4, "gums": 0}, "online": True}
body = json.dumps(machine)                 # ce que le serveur met dans la réponse
print(type(body), body)

response = (
    "HTTP/1.1 200 OK\r\n"
    "Content-Type: application/json\r\n"
    f"Content-Length: {len(body.encode())}\r\n"
    "\r\n"
    + body
)
print(response)

status_line, _, rest = response.partition("\r\n")
headers, _, content = rest.partition("\r\n\r\n")   # une ligne vide sépare en-têtes et corps
print(status_line.split()[1], json.loads(content)["items"])
```

### Votre ordinateur comme serveur

Votre propre machine a toujours l'adresse `127.0.0.1`, de nom `localhost`. Python fournit un petit serveur web prêt à l'emploi, qui sert les fichiers du dossier courant (à lancer dans un terminal, puis ouvrir <http://localhost:8000>) :

```text
C:\Users\me> python -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
::1 - - [12/Sep/2022 11:02:59] "GET / HTTP/1.1" 200 -
```

> 💡 Ouvrez les outils de développement de votre navigateur (F12, onglet *Réseau* / *Network*) : vous y verrez chaque requête, ses en-têtes et la réponse.

> 🎯 **À retenir** : client → requête HTTP (méthode, chemin, en-têtes, corps) → serveur → réponse (statut, en-têtes, corps) ; IP, DNS (nom → IP), port (443 pour HTTPS), TCP, paquets ; codes 200, 301/302, 404, 500 ; une API renvoie des données sérialisées (JSON) ; `localhost` = `127.0.0.1`.
