### Le piège de l'argument par défaut mutable

Une valeur par défaut est évaluée **une seule fois**, quand l'instruction `def` s'exécute, et non à chaque appel. Si cette valeur est mutable, tous les appels qui l'utilisent **partagent le même objet** :

```python
def ajouter_article(article, panier=[]):    # [] créée UNE fois, à la définition
    panier.append(article)
    return panier

print(ajouter_article("pomme"))   # ['pomme']
print(ajouter_article("poire"))   # ['pomme', 'poire']  ← même liste !
print(ajouter_article.__defaults__)
```

La solution : utiliser `None` comme valeur par défaut, et créer l'objet dans le corps de la fonction.

```python
def ajouter_article(article, panier=None):
    if panier is None:
        panier = []                # une liste neuve à chaque appel
    panier.append(article)
    return panier

print(ajouter_article("pomme"), ajouter_article("poire"))
```

> ⚠️ **Règle** : n'utilisez jamais une liste, un dictionnaire ou un ensemble comme valeur par défaut. Utilisez `None`.

### Nombre variable d'arguments : `*args` et `**kwargs`

- `*args` regroupe les arguments **positionnels** supplémentaires dans un **tuple** ;
- `**kwargs` regroupe les arguments **nommés** supplémentaires dans un **dictionnaire**.

```python
def journal(niveau, *messages, **contexte):
    print(f"[{niveau}]", " ".join(messages), contexte)

journal("INFO", "démarrage", "du", "serveur", port=8000, debug=True)
```

### Arguments « nommés obligatoirement » (*keyword-only*)

Les paramètres placés **après** `*args` (ou après une étoile seule `*`) ne peuvent être passés que **par leur nom**. C'est idéal pour les options, qui deviennent explicites à l'appel :

```python
def connecter(hote, *, port=443, chiffre=True):
    return f"{hote}:{port} (chiffré : {chiffre})"

print(connecter("exemple.fr", port=8080))
try:
    connecter("exemple.fr", 8080)          # port passé par position : refusé
except TypeError as e:
    print("TypeError :", e)
```

### Déballer une liste ou un dictionnaire à l'appel

À l'**appel**, `*` étale une séquence en arguments positionnels et `**` étale un dictionnaire en arguments nommés :

```python
def volume(longueur, largeur, hauteur):
    return longueur * largeur * hauteur

dimensions = [2, 3, 4]
print(volume(*dimensions))                 # volume(2, 3, 4)

mesures = {"hauteur": 4, "longueur": 2, "largeur": 3}
print(volume(**mesures))                   # volume(longueur=2, largeur=3, hauteur=4)

print(max(*[3, 9, 2]), "|", *["a", "b", "c"], sep=" ")
```

> 💡 **Quand utiliser `*args` ?** Quand la fonction traite vraiment « autant de valeurs qu'on veut » de même nature (`max`, `print`, une somme…). Sinon, des paramètres nommés explicites documentent mieux ce que la fonction attend : `*args` peut alors **cacher** l'interface.

> 🎯 **À retenir** : valeur par défaut mutable → `None` ; `*args` = tuple, `**kwargs` = dictionnaire ; les paramètres après `*` sont nommés obligatoirement ; `f(*liste)` et `f(**dico)` déballent à l'appel.
