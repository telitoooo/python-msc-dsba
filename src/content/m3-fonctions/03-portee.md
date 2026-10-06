### Variables locales

Une définition de fonction crée une nouvelle **portée** (*scope*) : une zone où des variables sont valides. Une variable créée **dans** une fonction (y compris ses paramètres) est **locale** : elle n'existe que pendant l'appel et disparaît ensuite.

```python raises=NameError
def calculer():
    resultat = 42      # variable locale
    return resultat

print(calculer())
print(resultat)        # NameError : resultat n'existe pas ici (erreur attendue !)
```

Exemple du cours : deux variables `m` coexistent, l'une **globale**, l'autre **locale** à la fonction.

```python
m = "Hello, world"

def average(a, b):
    m = (a + b) / 2         # un autre m, local à average
    return m

x = average(1, 2)
print(m)                    # affiche "Hello, world"
```

> 💡 Contrairement à d'autres langages, les blocs `if`, `while` et `for` ne créent **pas** de nouvelle portée : une variable créée dans une boucle existe encore après la boucle.

### Lire une variable globale : autorisé

Une variable définie au niveau principal du programme est **globale**. Une fonction peut la **lire**.

```python
TAUX_TVA = 0.2          # constante globale (convention : MAJUSCULES)

def prix_ttc(ht):
    return ht * (1 + TAUX_TVA)   # lecture d'une globale : OK

print(prix_ttc(100))
```

### Modifier une globale : le piège

Dès qu'une fonction **affecte** une variable (`x = ...`, `x += ...`), Python la considère **locale dans toute la fonction**. Lire sa valeur avant l'affectation provoque alors une `UnboundLocalError`.

```python raises=UnboundLocalError
compteur = 0

def incrementer():
    compteur = compteur + 1    # compteur est locale... mais pas encore définie !

incrementer()                  # UnboundLocalError (erreur attendue)
```

**Solution recommandée** : passer la valeur en paramètre et **renvoyer** le résultat. On obtient une *fonction pure*, prévisible et facile à tester.

```python
def incrementer(valeur):
    return valeur + 1

compteur = 0
compteur = incrementer(compteur)
compteur = incrementer(compteur)
print(compteur)
```

> ⚠️ Le mot-clé `global compteur` permet de modifier la globale depuis la fonction, mais **à éviter** : le code devient difficile à suivre et à déboguer, car n'importe quelle fonction peut changer l'état du programme.

### La règle LEGB

Pour trouver la valeur d'un nom, Python cherche dans cet ordre :

| Lettre | Portée | Exemple |
|---|---|---|
| **L** | Locale : la fonction en cours | paramètres, variables créées dans la fonction |
| **E** | Englobante (*Enclosing*) : fonction qui contient la fonction | fonctions imbriquées |
| **G** | Globale : le module | variables définies hors de toute fonction |
| **B** | *Built-in* : noms prédéfinis de Python | `print`, `len`, `sum`… |

```python
x = "global"

def externe():
    x = "englobante"
    def interne():
        return x               # pas de x local → on remonte : E
    return interne()

print(externe())               # englobante
print(x)                       # global : jamais modifiée
```

> ⚠️ Ne nommez jamais une variable `list`, `sum`, `max` ou `print` : vous masqueriez la fonction *built-in* correspondante (règle LEGB !).

### Paramètres et variables homonymes

Un paramètre est une variable **locale**, même s'il porte le même nom qu'une globale :

```python
x = 10

def doubler(x):
    x = x * 2          # modifie le x local uniquement
    return x

print(doubler(x), x)   # 20 10
```

### Pour aller plus loin : les fermetures (closures)

Une fonction interne peut « se souvenir » des variables de la fonction qui l'a créée. Le mot-clé `nonlocal` permet de **modifier** une variable englobante.

```python
def creer_multiplicateur(facteur):
    def multiplier(x):
        return x * facteur      # facteur vient de la portée englobante
    return multiplier           # on renvoie la fonction elle-même

triple = creer_multiplicateur(3)
print(triple(5), triple(10))
```

> 🎯 **À retenir** : les variables d'une fonction sont locales ; on peut lire une globale mais pas l'affecter sans `global` ; préférez paramètres + `return` ; Python résout les noms selon LEGB.
