### Répéter tant qu'une condition est vraie

Une clause `if` exécute un bloc **une fois** si un critère est vrai ; une clause `while` l'exécute **tant que** le critère reste vrai. On l'utilise quand on ne sait pas à l'avance combien de tours seront nécessaires.

```python
a = 1
while a < 2000:
    print(a)
    a = a * 2            # indispensable : sinon la boucle ne s'arrête jamais
```

| Situation | Boucle conseillée |
|---|---|
| nombre de tours connu (parcourir une séquence, répéter `n` fois) | `for` |
| on s'arrête quand une condition change (objectif atteint, saisie valide…) | `while` |

```python
# Combien d'années pour qu'une population de 1000 dépasse 1500 avec +4 %/an ?
population = 1000
annees = 0
while population <= 1500:
    population *= 1.04
    annees += 1
print(annees, "ans →", round(population), "habitants")
```

> ⚠️ **Boucle infinie** : si la condition ne devient jamais fausse, le programme tourne sans fin. Sur ce site, l'exécution est automatiquement stoppée au bout de 10 secondes (ou avec le bouton **Arrêter**). Vérifiez toujours que la variable testée **évolue** dans la boucle.

### Interrompre une boucle : `break`, `continue`, `else`

- `break` **sort immédiatement** de la boucle ;
- `continue` **arrête le tour en cours** et passe directement au suivant ;
- `else` : une clause **finale**, exécutée après le dernier tour de la boucle… **sauf** si on en est sorti par `break`.

Ils fonctionnent avec `while` comme avec `for`.

```python
i = 0
while True:              # boucle « infinie » volontaire…
    if i > 5:
        break            # …dont on sort explicitement
    print(i, end=" ")
    i = i + 1
print()

for i in range(0, 6):
    if i % 2:
        continue         # on saute les nombres impairs
    print(i, end=" ")
else:
    print(f"\nelse block in loop after {i}")
```

Le `else` d'une boucle est idéal pour une **recherche** : il s'exécute si l'on n'a **pas** trouvé (pas de `break`).

```python
n = 91
for d in range(2, n):
    if n % d == 0:
        print(n, "est divisible par", d)
        break
else:
    print(n, "est premier")
```

### Équivalences entre boucles

Toute boucle `for` sur un intervalle peut s'écrire avec `while`. Python n'a pas de boucle `repeat … until` ni `do … while` (où le corps s'exécute **au moins une fois**) : on les **émule**.

```python
# for i in range(a, b): …    équivaut à :
a, b = 2, 5
i = a
while i < b:
    print("tour", i)
    i += 1

# « do … while condition » : le corps s'exécute au moins une fois
compteur = 10
while True:
    print("exécuté au moins une fois, compteur =", compteur)
    compteur += 1
    if not compteur < 5:     # on teste la condition À LA FIN
        break
```

> 💡 On écrit `while condition:` et `if condition:`, jamais `while condition == True:` : la condition est déjà un booléen.

### Le pattern « saisie validée »

`while True` + `break` est idéal pour redemander une valeur tant qu'elle est incorrecte :

```python stdin=abc|-3|42
while True:
    reponse = input("Entrez un nombre positif : ")
    if reponse.isdigit():
        break
    print("Ce n'est pas un nombre positif, recommencez.")

nombre = int(reponse)
print("Merci, vous avez saisi", nombre)
```

> 💡 `isdigit()` renvoie `True` si la chaîne ne contient que des chiffres : pratique pour vérifier une saisie **avant** d'appeler `int()`, qui lèverait une `ValueError`.

> 🎯 **À retenir** : `while condition:` répète tant que c'est vrai ; faites évoluer la condition ; `break` sort, `continue` saute au tour suivant, `else` s'exécute si la boucle n'a pas été interrompue ; `while True` + `break` émule `do … while`.
