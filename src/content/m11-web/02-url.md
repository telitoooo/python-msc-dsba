### Définition

Wikipédia : *« Une URL (Uniform Resource Locator), couramment appelée adresse web, est une référence à une ressource web qui précise son emplacement sur un réseau informatique et un mécanisme pour la récupérer. »* Pour afficher une page, il faut dire **exactement** sur quel ordinateur elle se trouve et laquelle on veut :

```text
URL = scheme://username:password@host:port/path?query#fragment
```

### Les parties d'une URL

| Partie | Rôle | Exemple |
|---|---|---|
| **scheme** (protocole) | comment formuler la requête, quel type de réponse attendre | `http` (pages web), `https` (idem, chiffré), `ftp` (transfert de fichiers), `file` (fichier local), `mailto` (e-mail) |
| **username:password** | identifiants ; rarement utilisés sur le web, plutôt pour se connecter à une base de données | `postgres://ada:secret@db.example.com/sales` |
| **host** (hôte) | la machine du réseau où se trouve la ressource : nom de domaine, sous-domaine ou adresse IP | `www.google.com`, `176.159.37.246` |
| **port** | le programme serveur auquel parler sur cette machine ; souvent implicite | `:5000` |
| **path** (chemin) | la fonctionnalité demandée, la **route** ; le serveur associe chaque route à une fonction, le **gestionnaire** (*handler*) | `/search` |
| **query** (requête) | les **arguments** du gestionnaire : `nom=valeur`, séparés par `&` | `q=ip+address&hl=fr` |
| **fragment** | une partie du document où placer la vue ; **n'est pas envoyé au serveur** | `#The_Civil_War` |

Ports implicites les plus courants : **80** (HTTP), **443** (HTTPS), 22 (SSH), 25 / 465 (SMTP / SMTPS, e-mail), 53 (DNS), 3306 (MySQL), 27017 (MongoDB), 6379 (Redis). Sur Internet, votre FAI vous attribue en général une adresse IP pour 24 heures.

### Exemple : une recherche Google

`https://www.google.com/search?q=ip+address` signifie : on communique avec le serveur de Google en `https` ; l'hôte est `www.google.com`, port **443** par défaut ; on demande une recherche (chemin `/search`) ; le paramètre `q` vaut `"ip address"`.

> ⚠️ Une URL ne peut pas contenir n'importe quel caractère : les valeurs sont **encodées** (*échappées*). Une espace devient `+` (ou `%20`), `é` devient `%C3%A9`, `&` devient `%26`…

### Le fragment n'est pas envoyé

Pour `https://en.wikipedia.org/wiki/Abraham_Lincoln#The_Civil_War`, le navigateur envoie seulement :

```text
Request URL: https://en.wikipedia.org/wiki/Abraham_Lincoln
Request Method: GET
Remote Address: 91.198.174.192:443
```

puis fait lui-même défiler la page jusqu'à la section `The_Civil_War`.

### Décomposer une URL en Python : `urllib.parse`

```python
from urllib.parse import parse_qs, quote_plus, unquote_plus, urlencode, urljoin, urlparse

url = "https://ada:secret@www.example.com:8080/search/results?q=ip+address&page=2#top"
parts = urlparse(url)
print(parts.scheme, parts.username, parts.password)
print(parts.hostname, parts.port, parts.path)
print(parts.query, "→", parse_qs(parts.query))    # dictionnaire de listes de valeurs
print(parts.fragment)

print(urlparse("https://www.google.com/search?q=ip+address").port)   # None : port implicite (443)

print(quote_plus("café & croissants"))            # encoder une valeur
print(unquote_plus("caf%C3%A9+%26+croissants"))   # décoder
print(urlencode({"q": "ip address", "page": 2}))  # construire une query
print(urljoin("https://www.example.com/wiki/Python", "Guido"))   # URL relative → absolue
```

> 🎯 **À retenir** : `scheme://user:password@host:port/path?query#fragment` ; le port est souvent implicite (80 / 443) ; le chemin est la route vers un gestionnaire, la query ses arguments (`&`, valeurs encodées : espace → `+`) ; le fragment reste dans le navigateur ; `urllib.parse` : `urlparse`, `parse_qs`, `urlencode`, `quote_plus`.
