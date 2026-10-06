import { md, py, test } from "../helpers.js";
import { FAKEWEB, MACHINE_HTML, MACHINE_PY } from "./fakeweb.js";

const RAW_REQUEST = py`
  RAW = (
      "GET /tensorflow/tensorflow HTTP/1.1\r\n"
      "Host: github.com\r\n"
      "User-Agent: Mozilla/5.0\r\n"
      "Accept-Language: en-US,en;q=0.9,fr;q=0.8\r\n"
      "\r\n"
  )
`;

const HTTP_TOOLS = py`
  import json
  from urllib.parse import parse_qs

  STATUS = {200: "OK", 404: "Not Found", 405: "Method Not Allowed"}


  def parse_request(raw):
      head, _, body = raw.partition("\r\n\r\n")
      request_line, *header_lines = head.split("\r\n")
      method, target, version = request_line.split(" ")
      headers = dict(line.split(": ", 1) for line in header_lines if line)
      return {"method": method, "path": target, "version": version, "headers": headers, "body": body}


  def make_response(status, body, content_type="text/html; charset=utf-8"):
      return (
          f"HTTP/1.1 {status} {STATUS[status]}\r\n"
          f"Content-Type: {content_type}\r\n"
          f"Content-Length: {len(body.encode('utf-8'))}\r\n"
          "\r\n" + body
      )
`;

const URLS = py`
  URLS = [
      "https://www.google.com/search?q=ip+address",
      "http://localhost:5000/custom/Ada",
      "https://en.wikipedia.org/wiki/Abraham_Lincoln#The_Civil_War",
      "ftp://ada:secret@files.example.com/pub/data.csv",
      "https://api.vending.example/sales?machine=hall&page=2",
  ]
  DEFAULT_PORTS = {"http": 80, "https": 443, "ftp": 21}
`;

const FLASK_FILES = { "machine.py": MACHINE_PY, "templates/machine.html": MACHINE_HTML };

export default {
  // ---------------------------------------------------------------- 11.1
  "m11-l1": [
    {
      id: "ex1",
      title: "HTTP à la main",
      tiers: {
        core: {
          title: "Lire une requête HTTP",
          prompt: md`
            Une requête HTTP est un simple texte : une ligne de requête (\`méthode chemin version\`), des lignes
            d'en-têtes \`Nom: valeur\`, une ligne vide, puis un corps éventuel. Les lignes sont séparées par \`"\\r\\n"\`.

            Écrivez \`parse_request(raw)\` qui renvoie un dictionnaire :
            \`{"method": …, "path": …, "version": …, "headers": {nom: valeur, …}, "body": …}\`.
            Testez-la sur \`RAW\`, la requête envoyée par le navigateur pour \`https://github.com/tensorflow/tensorflow\`.
          `,
          hint: md`
            \`raw.partition("\\r\\n\\r\\n")\` sépare la tête du corps. Puis \`head.split("\\r\\n")\` : la première ligne est
            la ligne de requête, les suivantes les en-têtes (\`line.split(": ", 1)\` coupe au premier \`": "\`).
          `,
          starter: py`
            ${RAW_REQUEST}


            def parse_request(raw):
                ...


            request = parse_request(RAW)
            print(request["method"], request["path"])
            print(request["headers"])
          `,
          solution: py`
            ${RAW_REQUEST}


            def parse_request(raw):
                head, _, body = raw.partition("\r\n\r\n")
                request_line, *header_lines = head.split("\r\n")
                method, path, version = request_line.split(" ")
                headers = {}
                for line in header_lines:
                    name, value = line.split(": ", 1)
                    headers[name] = value
                return {"method": method, "path": path, "version": version, "headers": headers, "body": body}


            request = parse_request(RAW)
            print(request["method"], request["path"])
            print(request["headers"])
          `,
          tests: [
            test("Méthode, chemin et version", "(lambda r: (r['method'], r['path'], r['version']))(parse_request(RAW)) == ('GET', '/tensorflow/tensorflow', 'HTTP/1.1')"),
            test(
              "Les en-têtes forment un dictionnaire",
              "parse_request(RAW)['headers'] == {'Host': 'github.com', 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8'}",
              "parse_request(RAW)['headers']",
            ),
            test("Le corps est vide pour un GET", "parse_request(RAW)['body'] == ''"),
            test(
              "Une requête POST avec un corps",
              "(lambda r: (r['method'], r['path'], r['headers']['Content-Type'], r['body']))(parse_request('POST /buy HTTP/1.1\\r\\nHost: localhost:5000\\r\\nContent-Type: application/x-www-form-urlencoded\\r\\n\\r\\nitem=candy')) == ('POST', '/buy', 'application/x-www-form-urlencoded', 'item=candy')",
            ),
          ],
        },
        extra: {
          title: "Construire et lire une réponse",
          prompt: md`
            1. \`make_response(status, body, content_type="text/html; charset=utf-8")\` construit la réponse HTTP :
               ligne de statut \`HTTP/1.1 <code> <texte>\` (textes dans \`STATUS\`), en-têtes \`Content-Type\` et
               \`Content-Length\` (taille du corps **en octets UTF-8** : \`len(body.encode("utf-8"))\`), ligne vide, corps.
            2. \`parse_response(raw)\` fait l'inverse : renvoie \`(code (int), en-têtes (dict), corps)\`.
            3. \`api_response(data)\` renvoie une réponse 200 dont le corps est \`data\` sérialisé en JSON, avec le type
               \`application/json\`.
          `,
          starter: py`
            import json

            STATUS = {200: "OK", 301: "Moved Permanently", 404: "Not Found", 500: "Internal Server Error"}


            def make_response(status, body, content_type="text/html; charset=utf-8"):
                ...


            def parse_response(raw):
                ...


            def api_response(data):
                ...


            print(make_response(200, "<h1>Hi</h1>"))
            print(parse_response(api_response({"candy": 3})))
          `,
          solution: py`
            import json

            STATUS = {200: "OK", 301: "Moved Permanently", 404: "Not Found", 500: "Internal Server Error"}


            def make_response(status, body, content_type="text/html; charset=utf-8"):
                return (
                    f"HTTP/1.1 {status} {STATUS[status]}\r\n"
                    f"Content-Type: {content_type}\r\n"
                    f"Content-Length: {len(body.encode('utf-8'))}\r\n"
                    "\r\n" + body
                )


            def parse_response(raw):
                head, _, body = raw.partition("\r\n\r\n")
                status_line, *header_lines = head.split("\r\n")
                status = int(status_line.split(" ")[1])
                headers = dict(line.split(": ", 1) for line in header_lines)
                return status, headers, body


            def api_response(data):
                return make_response(200, json.dumps(data), "application/json")


            print(make_response(200, "<h1>Hi</h1>"))
            print(parse_response(api_response({"candy": 3})))
          `,
          tests: [
            test(
              "`make_response(200, \"<h1>Hi</h1>\")` exactement",
              "make_response(200, '<h1>Hi</h1>') == 'HTTP/1.1 200 OK\\r\\nContent-Type: text/html; charset=utf-8\\r\\nContent-Length: 11\\r\\n\\r\\n<h1>Hi</h1>'",
              "make_response(200, '<h1>Hi</h1>')",
            ),
            test("`Content-Length` compte les octets (« café » = 5)", "'Content-Length: 5\\r\\n' in make_response(404, 'café')"),
            test(
              "`parse_response` renvoie code, en-têtes et corps",
              "parse_response(make_response(404, 'Not here')) == (404, {'Content-Type': 'text/html; charset=utf-8', 'Content-Length': '8'}, 'Not here')",
            ),
            test(
              "`api_response` sérialise en JSON",
              "(lambda r: (r[0], r[1]['Content-Type'], json.loads(r[2])))(parse_response(api_response({'candy': 3, 'gums': [1, 2]}))) == (200, 'application/json', {'candy': 3, 'gums': [1, 2]})",
            ),
          ],
        },
        stretch: {
          title: "Un mini-serveur sans réseau",
          prompt: md`
            \`parse_request\` et \`make_response\` sont fournies. Écrivez le cœur d'un serveur web :
            \`handle(raw_request, routes)\` reçoit le **texte** d'une requête et renvoie le **texte** de la réponse.

            - si la méthode n'est pas \`GET\` → \`405\`, corps \`"Method Not Allowed"\` ;
            - le chemin peut contenir une *query* (\`/price?item=candy\`) : séparez-les, et transformez la query en
              dictionnaire \`{nom: valeur}\` (\`parse_qs\`, en gardant la première valeur) ;
            - si le chemin n'est pas dans \`routes\` → \`404\`, corps \`"Not Found"\` ;
            - sinon, appelez le **gestionnaire** \`routes[chemin](query)\` : s'il renvoie une chaîne → \`200\` en HTML ;
              s'il renvoie un dictionnaire ou une liste → \`200\` en JSON (\`application/json\`).

            Définissez ensuite les trois gestionnaires du distributeur : \`home\` (une page HTML contenant
            \`<h1>Vending machine</h1>\`), \`machine_state\` (renvoie \`STOCK\`) et \`price\` (renvoie
            \`{"item": …, "price": …}\` pour l'article \`query["item"]\`), et le dictionnaire \`routes\`.
          `,
          starter: py`
            ${HTTP_TOOLS}

            STOCK = {"candy": 3, "chocolate": 10, "gums": 0}
            PRICES = {"candy": 0.5, "chocolate": 1.5, "gums": 0.8}


            def handle(raw_request, routes):
                ...


            def home(query):
                ...


            def machine_state(query):
                ...


            def price(query):
                ...


            routes = {"/": home, "/machine": machine_state, "/price": price}
            print(handle("GET /price?item=candy HTTP/1.1\r\nHost: localhost\r\n\r\n", routes))
          `,
          solution: py`
            ${HTTP_TOOLS}

            STOCK = {"candy": 3, "chocolate": 10, "gums": 0}
            PRICES = {"candy": 0.5, "chocolate": 1.5, "gums": 0.8}


            def handle(raw_request, routes):
                request = parse_request(raw_request)
                if request["method"] != "GET":
                    return make_response(405, "Method Not Allowed")
                path, _, query_string = request["path"].partition("?")
                query = {name: values[0] for name, values in parse_qs(query_string).items()}
                if path not in routes:
                    return make_response(404, "Not Found")
                result = routes[path](query)
                if isinstance(result, str):
                    return make_response(200, result)
                return make_response(200, json.dumps(result), "application/json")


            def home(query):
                return "<h1>Vending machine</h1><p>Try /machine or /price?item=candy</p>"


            def machine_state(query):
                return STOCK


            def price(query):
                item = query["item"]
                return {"item": item, "price": PRICES[item]}


            routes = {"/": home, "/machine": machine_state, "/price": price}
            print(handle("GET /price?item=candy HTTP/1.1\r\nHost: localhost\r\n\r\n", routes))
          `,
          tests: [
            test(
              "`GET /` renvoie la page d'accueil en HTML",
              "(lambda r: r.startswith('HTTP/1.1 200 OK') and 'text/html' in r and '<h1>Vending machine</h1>' in r)(handle('GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n', routes))",
            ),
            test(
              "`GET /machine` renvoie le stock en JSON",
              "(lambda r: 'application/json' in r and json.loads(r.split('\\r\\n\\r\\n', 1)[1]) == STOCK)(handle('GET /machine HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n', routes))",
            ),
            test(
              "`GET /price?item=chocolate` utilise la query",
              "json.loads(handle('GET /price?item=chocolate HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n', routes).split('\\r\\n\\r\\n', 1)[1]) == {'item': 'chocolate', 'price': 1.5}",
            ),
            test("Chemin inconnu → 404", "handle('GET /nowhere HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n', routes).startswith('HTTP/1.1 404 Not Found')"),
            test("Méthode autre que GET → 405", "handle('POST / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\nitem=candy', routes).startswith('HTTP/1.1 405 Method Not Allowed')"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 11.2
  "m11-l2": [
    {
      id: "ex1",
      title: "Anatomie d'une URL",
      tiers: {
        core: {
          title: "Disséquer une URL avec urllib.parse",
          prompt: md`
            Écrivez \`describe_url(url)\` qui renvoie un dictionnaire \`{"scheme", "host", "port", "path", "query",
            "fragment"}\` à l'aide de \`urllib.parse\` :

            - \`host\` : le nom d'hôte seul (sans identifiants ni port : \`parts.hostname\`) ;
            - \`port\` : le port écrit dans l'URL, sinon le port **par défaut** du protocole (\`DEFAULT_PORTS\`) ;
            - \`path\` : \`"/"\` si l'URL n'a pas de chemin ;
            - \`query\` : un dictionnaire \`nom → valeur\` (première valeur de \`parse_qs\`, donc décodée : \`+\` → espace) ;
            - \`fragment\` : chaîne vide s'il n'y en a pas.
          `,
          starter: py`
            from urllib.parse import parse_qs, urlparse

            ${URLS}


            def describe_url(url):
                ...


            for url in URLS:
                print(describe_url(url))
          `,
          solution: py`
            from urllib.parse import parse_qs, urlparse

            ${URLS}


            def describe_url(url):
                parts = urlparse(url)
                return {
                    "scheme": parts.scheme,
                    "host": parts.hostname,
                    "port": parts.port or DEFAULT_PORTS.get(parts.scheme),
                    "path": parts.path or "/",
                    "query": {name: values[0] for name, values in parse_qs(parts.query).items()},
                    "fragment": parts.fragment,
                }


            for url in URLS:
                print(describe_url(url))
          `,
          tests: [
            test(
              "La recherche Google",
              "describe_url(URLS[0]) == {'scheme': 'https', 'host': 'www.google.com', 'port': 443, 'path': '/search', 'query': {'q': 'ip address'}, 'fragment': ''}",
              "describe_url(URLS[0])",
            ),
            test("Port explicite : localhost:5000", "describe_url(URLS[1])['port'] == 5000 and describe_url(URLS[1])['host'] == 'localhost'", "describe_url(URLS[1])"),
            test("Le fragment Wikipédia", "describe_url(URLS[2])['fragment'] == 'The_Civil_War' and describe_url(URLS[2])['query'] == {}"),
            test("Identifiants exclus de l'hôte, port FTP par défaut", "(lambda d: (d['host'], d['port'], d['path']))(describe_url(URLS[3])) == ('files.example.com', 21, '/pub/data.csv')"),
            test("Plusieurs paramètres", "describe_url(URLS[4])['query'] == {'machine': 'hall', 'page': '2'}"),
            test("Une URL sans chemin", "describe_url('https://example.com')['path'] == '/'"),
          ],
        },
        extra: {
          title: "Le même, à la main",
          prompt: md`
            Écrivez \`split_url(url)\`, qui renvoie **le même dictionnaire** que \`describe_url\` (fournie, avec
            urllib), mais **sans** \`urlparse\` ni \`parse_qs\` : uniquement des méthodes de chaînes (\`partition\`,
            \`split\`, \`replace\`…). On suppose que les valeurs de la query ne contiennent que des lettres, des
            chiffres et des \`+\` (qui codent des espaces).
          `,
          hint: md`
            Découpez dans l'ordre : \`url.partition("#")\` (fragment), \`partition("?")\` (query), \`partition("://")\`
            (protocole), puis le premier \`"/"\` sépare l'« autorité » \`user:password@host:port\` du chemin. Dans
            l'autorité, gardez ce qui suit le dernier \`"@"\`, puis séparez \`host\` et \`port\` avec \`":"\`.
          `,
          starter: py`
            from urllib.parse import parse_qs, urlparse

            ${URLS}


            def describe_url(url):
                parts = urlparse(url)
                return {
                    "scheme": parts.scheme,
                    "host": parts.hostname,
                    "port": parts.port or DEFAULT_PORTS.get(parts.scheme),
                    "path": parts.path or "/",
                    "query": {name: values[0] for name, values in parse_qs(parts.query).items()},
                    "fragment": parts.fragment,
                }


            def split_url(url):
                ...


            for url in URLS:
                print(split_url(url) == describe_url(url), split_url(url))
          `,
          solution: py`
            from urllib.parse import parse_qs, urlparse

            ${URLS}


            def describe_url(url):
                parts = urlparse(url)
                return {
                    "scheme": parts.scheme,
                    "host": parts.hostname,
                    "port": parts.port or DEFAULT_PORTS.get(parts.scheme),
                    "path": parts.path or "/",
                    "query": {name: values[0] for name, values in parse_qs(parts.query).items()},
                    "fragment": parts.fragment,
                }


            def split_url(url):
                rest, _, fragment = url.partition("#")
                rest, _, query_string = rest.partition("?")
                scheme, _, rest = rest.partition("://")
                authority, slash, path = rest.partition("/")
                host_port = authority.split("@")[-1]
                host, _, port = host_port.partition(":")
                query = {}
                for pair in query_string.split("&"):
                    if pair:
                        name, _, value = pair.partition("=")
                        query.setdefault(name, value.replace("+", " "))
                return {
                    "scheme": scheme,
                    "host": host,
                    "port": int(port) if port else DEFAULT_PORTS.get(scheme),
                    "path": slash + path if slash else "/",
                    "query": query,
                    "fragment": fragment,
                }


            for url in URLS:
                print(split_url(url) == describe_url(url), split_url(url))
          `,
          tests: [
            test("Identique à `describe_url` sur les 5 URL", "all(split_url(u) == describe_url(u) for u in URLS)", "[u for u in URLS if split_url(u) != describe_url(u)]"),
            test(
              "Et sur d'autres URL",
              "all(split_url(u) == describe_url(u) for u in ['http://example.com', 'https://a.b.example.org:8443/x/y/z?k=v+w#frag', 'http://u@h.example/p'])",
            ),
            test("Sans `urlparse` ni `parse_qs` dans `split_url`", "not any(name in __import__('inspect').getsource(split_url) for name in ('urlparse', 'parse_qs', 'urlsplit'))"),
          ],
        },
        stretch: {
          title: "Construire une URL et la requête du navigateur",
          prompt: md`
            1. \`build_url(scheme, host, path="/", params=None, port=None, fragment=None)\` assemble une URL :
               le port n'est écrit que s'il diffère du port par défaut du protocole ; les paramètres sont encodés
               avec \`urlencode\` (espace → \`+\`) ; le fragment est ajouté après \`#\`.
            2. \`request_for(url)\` renvoie le **début de la requête** que le navigateur envoie pour cette URL :
               \`"GET <chemin>?<query> HTTP/1.1\\r\\nHost: <hôte>\\r\\n\\r\\n"\`. Le chemin vaut \`/\` s'il est vide,
               la query n'apparaît que si elle existe, l'en-tête \`Host\` contient le port s'il n'est pas celui par défaut…
               et le **fragment n'est jamais envoyé**.
          `,
          starter: py`
            from urllib.parse import urlencode, urlparse

            DEFAULT_PORTS = {"http": 80, "https": 443}


            def build_url(scheme, host, path="/", params=None, port=None, fragment=None):
                ...


            def request_for(url):
                ...


            url = build_url("https", "www.google.com", "/search", {"q": "ip address"})
            print(url)
            print(request_for("https://en.wikipedia.org/wiki/Abraham_Lincoln#The_Civil_War"))
          `,
          solution: py`
            from urllib.parse import urlencode, urlparse

            DEFAULT_PORTS = {"http": 80, "https": 443}


            def build_url(scheme, host, path="/", params=None, port=None, fragment=None):
                url = f"{scheme}://{host}"
                if port is not None and port != DEFAULT_PORTS.get(scheme):
                    url += f":{port}"
                url += path
                if params:
                    url += "?" + urlencode(params)
                if fragment:
                    url += "#" + fragment
                return url


            def request_for(url):
                parts = urlparse(url)
                target = parts.path or "/"
                if parts.query:
                    target += "?" + parts.query
                host = parts.hostname
                if parts.port and parts.port != DEFAULT_PORTS.get(parts.scheme):
                    host += f":{parts.port}"
                return f"GET {target} HTTP/1.1\r\nHost: {host}\r\n\r\n"


            url = build_url("https", "www.google.com", "/search", {"q": "ip address"})
            print(url)
            print(request_for("https://en.wikipedia.org/wiki/Abraham_Lincoln#The_Civil_War"))
          `,
          tests: [
            test("La recherche Google", "build_url('https', 'www.google.com', '/search', {'q': 'ip address'}) == 'https://www.google.com/search?q=ip+address'", "build_url('https', 'www.google.com', '/search', {'q': 'ip address'})"),
            test(
              "Port par défaut omis, port spécial écrit, fragment ajouté",
              "build_url('https', 'a.example', '/x', port=443) == 'https://a.example/x' and build_url('http', 'localhost', '/custom/Ada', port=5000, fragment='top') == 'http://localhost:5000/custom/Ada#top'",
            ),
            test(
              "Le fragment n'est pas envoyé au serveur",
              "request_for('https://en.wikipedia.org/wiki/Abraham_Lincoln#The_Civil_War') == 'GET /wiki/Abraham_Lincoln HTTP/1.1\\r\\nHost: en.wikipedia.org\\r\\n\\r\\n'",
              "request_for('https://en.wikipedia.org/wiki/Abraham_Lincoln#The_Civil_War')",
            ),
            test(
              "Query conservée, port non standard dans `Host`, chemin vide → `/`",
              "request_for('http://localhost:5000/search?q=ip+address') == 'GET /search?q=ip+address HTTP/1.1\\r\\nHost: localhost:5000\\r\\n\\r\\n' and request_for('https://example.com').startswith('GET / HTTP/1.1')",
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 11.3
  "m11-l3": [
    {
      id: "ex1",
      title: "Faire des requêtes HTTP",
      tiers: {
        core: {
          title: "Interroger l'API des distributeurs",
          prompt: md`
            \`fakeweb\` (dossier de travail) s'utilise **exactement comme** \`requests\` : \`session = fakeweb.Session()\`,
            puis \`session.get(url)\`. L'API des distributeurs est à l'adresse \`fakeweb.API\`.

            1. \`response\` : la réponse à \`GET <API>/machines\` ; \`status\` : son code ; \`machines\` : le corps JSON
               désérialisé (une liste de dictionnaires) ; \`locations\` : la liste des emplacements.
            2. \`get_machine(session, machine_id)\` : le dictionnaire de la machine (\`GET <API>/machines/<id>\`), ou
               \`None\` si elle n'existe pas. Utilisez \`raise_for_status()\` et interceptez \`fakeweb.HTTPError\`.
            3. \`available_items(session, machine_id)\` : la liste **triée** des articles en stock (quantité > 0)
               de cette machine, ou \`[]\` si elle n'existe pas.
          `,
          files: { "fakeweb.py": FAKEWEB },
          starter: py`
            import fakeweb

            API = fakeweb.API
            session = fakeweb.Session()

            response = ...
            status = ...
            machines = ...
            locations = ...


            def get_machine(session, machine_id):
                ...


            def available_items(session, machine_id):
                ...


            print(status, locations)
            print(get_machine(session, 2), get_machine(session, 99))
            print(available_items(session, 1))
          `,
          solution: py`
            import fakeweb

            API = fakeweb.API
            session = fakeweb.Session()

            response = session.get(API + "/machines")
            status = response.status_code
            machines = response.json()
            locations = [machine["location"] for machine in machines]


            def get_machine(session, machine_id):
                response = session.get(f"{API}/machines/{machine_id}")
                try:
                    response.raise_for_status()
                except fakeweb.HTTPError:
                    return None
                return response.json()


            def available_items(session, machine_id):
                machine = get_machine(session, machine_id)
                if machine is None:
                    return []
                return sorted(item for item, quantity in machine["items"].items() if quantity > 0)


            print(status, locations)
            print(get_machine(session, 2), get_machine(session, 99))
            print(available_items(session, 1))
          `,
          tests: [
            test("`status` vaut 200", "status == 200", "status"),
            test("`machines` : 3 machines désérialisées", "isinstance(machines, list) and len(machines) == 3 and machines[0]['id'] == 1"),
            test("`locations`", "locations == ['hall', 'library', 'gym']", "locations"),
            test("`get_machine` renvoie la machine, ou `None` (404)", "get_machine(fakeweb.Session(), 2)['location'] == 'library' and get_machine(fakeweb.Session(), 99) is None"),
            test("`raise_for_status` est utilisé", "calls('raise_for_status') and 'HTTPError' in SOURCE"),
            test("`available_items`", "available_items(fakeweb.Session(), 1) == ['candy', 'chocolate'] and available_items(fakeweb.Session(), 42) == []"),
          ],
        },
        extra: {
          title: "Statistiques de mots d'un livre",
          prompt: md`
            *Hands-on « Book Words Statistics » (séance 3).*

            1. Téléchargez le livre à l'adresse \`fakeweb.BOOK_URL\` (un extrait d'*Orgueil et Préjugés* sur le projet
               Gutenberg) et enregistrez son texte dans \`pride.txt\`.
            2. \`words(text)\` : la liste des mots en minuscules, ponctuation ignorée (\`re.findall(r"[a-z]+", …)\`).
            3. \`count_words(word_list)\` : un \`collections.Counter\` du nombre d'occurrences de chaque mot.
            4. \`save_counts(counts, path)\` : écrit une ligne \`"mot nombre"\` par mot, du plus fréquent au moins
               fréquent (à égalité : ordre alphabétique).
            5. \`top10\` : les 10 mots les plus fréquents du livre, sous forme de liste de tuples \`(mot, nombre)\`
               dans le même ordre ; écrivez aussi le classement complet dans \`counts.txt\`.
          `,
          hint: md`
            Clé de tri : \`sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))\`.
          `,
          files: { "fakeweb.py": FAKEWEB },
          starter: py`
            import collections
            import re

            import fakeweb

            session = fakeweb.Session()


            def words(text):
                ...


            def count_words(word_list):
                ...


            def save_counts(counts, path):
                ...


            top10 = ...
            print(top10)
          `,
          solution: py`
            import collections
            import re

            import fakeweb

            session = fakeweb.Session()
            response = session.get(fakeweb.BOOK_URL)
            response.raise_for_status()
            with open("pride.txt", "w", encoding="utf-8") as f:
                f.write(response.text)


            def words(text):
                return re.findall(r"[a-z]+", text.lower())


            def count_words(word_list):
                return collections.Counter(word_list)


            def ranking(counts):
                return sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))


            def save_counts(counts, path):
                with open(path, "w", encoding="utf-8") as f:
                    for word, count in ranking(counts):
                        f.write(f"{word} {count}\n")


            with open("pride.txt", encoding="utf-8") as f:
                counts = count_words(words(f.read()))
            save_counts(counts, "counts.txt")
            top10 = ranking(counts)[:10]
            print(top10)
          `,
          tests: [
            test("`pride.txt` contient le livre téléchargé", "read_file('pride.txt') == fakeweb.Session().get(fakeweb.BOOK_URL).text"),
            test("`words` ignore la ponctuation et les majuscules", "words('It is a TRUTH, \"universally\" acknowledged!') == ['it', 'is', 'a', 'truth', 'universally', 'acknowledged']"),
            test("`count_words` renvoie un Counter", "count_words(['a', 'b', 'a']) == {'a': 2, 'b': 1} and isinstance(count_words([]), collections.Counter)"),
            test(
              "`top10` : les mots les plus fréquents",
              "top10 == sorted(collections.Counter(re.findall('[a-z]+', read_file('pride.txt').lower())).items(), key=lambda p: (-p[1], p[0]))[:10]",
              "top10",
            ),
            test(
              "`counts.txt` : une ligne « mot nombre » par mot, triées",
              "(lambda lines: lines[0] == ' '.join(map(str, top10[0])) and len(lines) == len(set(re.findall('[a-z]+', read_file('pride.txt').lower()))))(read_file('counts.txt').splitlines())",
            ),
          ],
        },
        stretch: {
          title: "POST, pagination et nouvelles tentatives",
          prompt: md`
            1. \`buy(session, machine_id, item)\` : envoie un \`POST\` sur \`<API>/machines/<id>/buy\` avec le corps JSON
               \`{"item": item}\` (\`json=…\`) et renvoie la quantité restante (\`"remaining"\`). Code 409 (épuisé) →
               lève \`ValueError\` ; 404 (machine ou article inconnu) → lève \`KeyError\`.
            2. \`all_sales(session)\` : l'API renvoie les ventes **par pages** de 5 (\`GET <API>/sales\` avec
               \`params={"page": n}\`). Récupérez les pages 1, 2, 3… jusqu'à une page vide et renvoyez la liste de toutes les ventes.
            3. \`get_with_retry(session, url, attempts=3)\` : envoie un \`GET\` et **réessaie** tant que le serveur répond
               une erreur 5xx, au plus \`attempts\` fois en tout. Renvoie la réponse réussie ; si toutes les tentatives
               échouent, lève l'erreur avec \`raise_for_status()\`. (\`https://flaky.example/status\` répond 503 deux fois, puis 200.)
          `,
          files: { "fakeweb.py": FAKEWEB },
          starter: py`
            import fakeweb

            API = fakeweb.API


            def buy(session, machine_id, item):
                ...


            def all_sales(session):
                ...


            def get_with_retry(session, url, attempts=3):
                ...


            session = fakeweb.Session()
            print(buy(session, 1, "candy"))
            sales = all_sales(session)
            print(len(sales), "sales,", round(sum(s["price"] for s in sales), 2))
            print(get_with_retry(session, "https://flaky.example/status"))
          `,
          solution: py`
            import fakeweb

            API = fakeweb.API


            def buy(session, machine_id, item):
                response = session.post(f"{API}/machines/{machine_id}/buy", json={"item": item})
                if response.status_code == 409:
                    raise ValueError(response.json()["error"])
                if response.status_code == 404:
                    raise KeyError(item)
                response.raise_for_status()
                return response.json()["remaining"]


            def all_sales(session):
                sales = []
                page = 1
                while True:
                    batch = session.get(f"{API}/sales", params={"page": page}).json()["sales"]
                    if not batch:
                        return sales
                    sales.extend(batch)
                    page += 1


            def get_with_retry(session, url, attempts=3):
                for _ in range(attempts):
                    response = session.get(url)
                    if response.status_code < 500:
                        return response
                response.raise_for_status()


            session = fakeweb.Session()
            print(buy(session, 1, "candy"))
            sales = all_sales(session)
            print(len(sales), "sales,", round(sum(s["price"] for s in sales), 2))
            print(get_with_retry(session, "https://flaky.example/status"))
          `,
          tests: [
            test("`buy` renvoie la quantité restante", "(lambda s: (buy(s, 1, 'candy'), buy(s, 1, 'candy')))(fakeweb.Session()) == (2, 1)"),
            test("`buy` envoie bien un POST JSON", "(lambda s: (buy(s, 3, 'cake'), s.history[-1]))(fakeweb.Session())[1] == ('POST', fakeweb.API + '/machines/3/buy')"),
            test("Épuisé → `ValueError`, inconnu → `KeyError`", "raises(ValueError, buy, fakeweb.Session(), 1, 'gums') and raises(KeyError, buy, fakeweb.Session(), 1, 'pizza') and raises(KeyError, buy, fakeweb.Session(), 99, 'candy')"),
            test(
              "`all_sales` parcourt les pages jusqu'à la page vide",
              "(lambda s: (len(all_sales(s)), [u for m, u in s.history]))(fakeweb.Session()) == (12, [fakeweb.API + '/sales?page=' + str(p) for p in (1, 2, 3, 4)])",
            ),
            test("`get_with_retry` finit par réussir (3 tentatives)", "(lambda s: (get_with_retry(s, 'https://flaky.example/status').status_code, len(s.history)))(fakeweb.Session()) == (200, 3)"),
            test("Trop peu de tentatives → `HTTPError`", "raises(fakeweb.HTTPError, get_with_retry, fakeweb.Session(), 'https://flaky.example/status', 2)"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 11.4
  "m11-l4": [
    {
      id: "ex1",
      title: "Un serveur web avec Flask",
      tiers: {
        core: {
          title: "Premières routes",
          prompt: md`
            Créez une application Flask \`app\` avec trois routes :

            - \`/\` → \`"Hello world!"\` ;
            - \`/custom/<name>\` → \`"Hello <name>"\` ;
            - \`/square/<int:n>\` → le JSON \`{"n": n, "square": n²}\` (\`flask.jsonify\`).

            Testez-les avec \`client = app.test_client()\` (\`client.get("/")\`…), et terminez par le lancement du serveur
            protégé par \`if __name__ == "__main__":\` (\`app.run(port=5000)\`, simulé dans le navigateur).
          `,
          starter: py`
            import flask

            app = ...


            client = app.test_client()
            print(client.get("/").data)
            print(client.get("/custom/Ada").data)
            print(client.get("/square/12").get_json())
          `,
          solution: py`
            import flask

            app = flask.Flask(__name__)


            @app.route("/")
            def index():
                return "Hello world!"


            @app.route("/custom/<name>")
            def custom(name):
                return "Hello {}".format(name)


            @app.route("/square/<int:n>")
            def square(n):
                return flask.jsonify({"n": n, "square": n * n})


            client = app.test_client()
            print(client.get("/").data)
            print(client.get("/custom/Ada").data)
            print(client.get("/square/12").get_json())

            if __name__ == "__main__":
                app.run(port=5000)
          `,
          tests: [
            test("`app` est une application Flask", "isinstance(app, flask.Flask)"),
            test("`/` → `Hello world!`", "(lambda r: (r.status_code, r.data))(app.test_client().get('/')) == (200, b'Hello world!')"),
            test("`/custom/<name>`", "app.test_client().get('/custom/Grace').data == b'Hello Grace'"),
            test("`/square/<int:n>` renvoie du JSON", "app.test_client().get('/square/7').get_json() == {'n': 7, 'square': 49} and app.test_client().get('/square/abc').status_code == 404"),
            test("Le serveur est lancé sous `if __name__ == \"__main__\":`", "calls('run') and '__main__' in SOURCE"),
          ],
        },
        extra: {
          title: "Le distributeur en ligne",
          prompt: md`
            *Exercice « Vending Machines again as a web server ».* La classe \`VendingMachine\` (\`machine.py\`) et le
            gabarit \`templates/machine.html\` sont fournis. Avec \`machine = VendingMachine()\` :

            1. \`/\` affiche le contenu de la machine : \`render_template("machine.html", products=…, profit=…)\` ;
            2. \`/buy/<item>\` achète l'article puis **redirige** vers \`/\` (\`flask.redirect\`, code 302) ; article inconnu →
               \`("unknown item", 404)\` ; épuisé → \`("sold out", 409)\` ;
            3. \`/refill\` remplit la machine puis redirige vers \`/\` ;
            4. \`/order\` renvoie en JSON ce qu'il faut commander (\`machine.to_order()\` : une liste de listes).
          `,
          files: FLASK_FILES,
          starter: py`
            import flask
            from machine import VendingMachine

            app = flask.Flask(__name__)
            machine = VendingMachine()

            # routes


            client = app.test_client()
            print(client.get("/").get_data(as_text=True))
          `,
          solution: py`
            import flask
            from machine import VendingMachine

            app = flask.Flask(__name__)
            machine = VendingMachine()


            @app.route("/")
            def index():
                return flask.render_template("machine.html", products=machine.products, profit=machine.profit)


            @app.route("/buy/<item>")
            def buy(item):
                try:
                    machine.buy(item)
                except KeyError:
                    return "unknown item", 404
                except ValueError:
                    return "sold out", 409
                return flask.redirect("/")


            @app.route("/refill")
            def refill():
                machine.refill()
                return flask.redirect("/")


            @app.route("/order")
            def order():
                return flask.jsonify(machine.to_order())


            client = app.test_client()
            print(client.get("/").get_data(as_text=True))

            if __name__ == "__main__":
                app.run(port=5000)
          `,
          tests: [
            test(
              "`/` affiche la page du gabarit avec les produits",
              "(lambda r: r.status_code == 200 and 'Web Vending Machine' in r.get_data(as_text=True) and 'chocolate' in r.get_data(as_text=True))(app.test_client().get('/'))",
            ),
            test(
              "`/buy/chocolate` achète puis redirige vers `/`",
              "(lambda before: (lambda r: (r.status_code, r.headers['Location'].endswith('/'), machine.products['chocolate'][1]))(app.test_client().get('/buy/chocolate')) == (302, True, before - 1))(machine.products['chocolate'][1])",
            ),
            test("Article épuisé → 409, inconnu → 404", "app.test_client().get('/buy/gums').status_code == 409 and app.test_client().get('/buy/pizza').status_code == 404"),
            test("`/order` renvoie la liste à commander en JSON", "app.test_client().get('/order').get_json() == machine.to_order() and ['gums', 10] in machine.to_order()"),
            test(
              "`/refill` remplit la machine puis redirige",
              "(lambda r: (r.status_code, [q for p, q in machine.products.values()]))(app.test_client().get('/refill')) == (302, [10, 10, 10])",
            ),
          ],
        },
        stretch: {
          title: "Persistance et journal des ventes",
          prompt: md`
            *Questions bonus du cours.* Quand on tue le serveur puis qu'on le relance, la machine repart pleine. Écrivez
            une **fabrique d'application** \`create_app(state_path="machine.pickle", log_path="sales.log")\` :

            1. elle crée une \`VendingMachine\` et, si \`state_path\` existe, recharge son état (\`machine.loads\`) ;
            2. \`GET /\` renvoie en JSON \`{"products": …, "profit": …}\` (profit arrondi à 2 décimales) ;
            3. \`POST /buy\` (champ de formulaire \`item\`) achète l'article, **ajoute** une ligne \`"item,prix"\`
               (prix avec 2 décimales) à \`log_path\`, sauvegarde l'état (\`machine.dumps\`) et redirige vers \`/\` ;
               erreurs : 404 (inconnu) et 409 (épuisé). Un \`GET /buy\` doit être refusé (405).

            Où faut-il appeler \`loads\` et \`dumps\` pour que le serveur retrouve toujours son dernier état ?
          `,
          files: FLASK_FILES,
          starter: py`
            import os

            import flask
            from machine import VendingMachine


            def create_app(state_path="machine.pickle", log_path="sales.log"):
                ...


            app = create_app()
            client = app.test_client()
            client.post("/buy", data={"item": "candy"})
            print(create_app().test_client().get("/").get_json())
          `,
          solution: py`
            import os

            import flask
            from machine import VendingMachine


            def create_app(state_path="machine.pickle", log_path="sales.log"):
                app = flask.Flask(__name__)
                machine = VendingMachine()
                if os.path.exists(state_path):
                    machine.loads(state_path)          # on start-up: restore the last state

                @app.route("/")
                def index():
                    return flask.jsonify({"products": machine.products, "profit": round(machine.profit, 2)})

                @app.route("/buy", methods=["POST"])
                def buy():
                    item = flask.request.form.get("item")
                    try:
                        price = machine.buy(item)
                    except KeyError:
                        return f"unknown item: {item}", 404
                    except ValueError:
                        return f"{item} is sold out", 409
                    with open(log_path, "a", encoding="utf-8") as log:
                        log.write(f"{item},{price:.2f}\n")
                    machine.dumps(state_path)          # after each change: save the state
                    return flask.redirect("/")

                return app


            app = create_app()
            client = app.test_client()
            client.post("/buy", data={"item": "candy"})
            print(create_app().test_client().get("/").get_json())
          `,
          tests: [
            test(
              "`POST /buy` achète et redirige",
              "(lambda c: (c.post('/buy', data={'item': 'candy'}).status_code, c.post('/buy', data={'item': 'chocolate'}).status_code))(create_app('t.pickle', 't.log').test_client()) == (302, 302)",
            ),
            test("Chaque vente est ajoutée au journal", "read_file('t.log').splitlines() == ['candy,0.50', 'chocolate,1.50']", "read_file('t.log')"),
            test(
              "Un nouveau serveur retrouve l'état sauvegardé",
              "(lambda d: (d['products']['candy'][1], d['products']['chocolate'][1], d['profit']))(create_app('t.pickle', 't.log').test_client().get('/').get_json()) == (2, 9, 2.0)",
            ),
            test(
              "Erreurs 404 / 409 / 405",
              "(lambda c: (c.post('/buy', data={'item': 'pizza'}).status_code, c.post('/buy', data={'item': 'gums'}).status_code, c.get('/buy').status_code))(create_app('u.pickle', 'u.log').test_client()) == (404, 409, 405)",
            ),
            test("Les erreurs ne sont pas journalisées", "not file_exists('u.log')"),
          ],
        },
      },
    },
  ],
};
