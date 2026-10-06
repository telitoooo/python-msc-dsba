import { py } from "../helpers.js";

/**
 * fakeweb.py : imitation hors ligne du paquet `requests`, déposée dans le dossier de travail
 * des exercices de la leçon 11.3 (dans le navigateur, la plupart des sites refusent les
 * requêtes venant d'un autre site : politique CORS).
 */
export const FAKEWEB = py`
  """
  fakeweb: an offline imitation of the requests library, for the exercises run in
  the browser (where most websites refuse requests coming from another site: CORS).

  fakeweb.Session() offers get() and post() with the same parameters and the same
  Response objects as requests (status_code, ok, text, content, headers, json(),
  raise_for_status()). It answers from a tiny built-in "Internet":

    - https://api.vending.example/machines                 GET: list of machines
    - https://api.vending.example/machines/<id>            GET: one machine
    - https://api.vending.example/machines/<id>/buy        POST json={"item": ...}
    - https://api.vending.example/sales?page=<n>           GET: 5 sales per page
    - https://www.gutenberg.org/cache/epub/1342/pg1342.txt GET: Pride and Prejudice (excerpt)
    - https://flaky.example/status                         GET: 503 twice, then 200

  On your computer, use "import requests" and requests.Session() instead.
  """
  import json as _json
  from urllib.parse import parse_qs, urlencode, urlparse

  API = "https://api.vending.example"
  BOOK_URL = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"


  class RequestException(Exception):
      """Base class of all errors (like requests.exceptions.RequestException)."""


  class HTTPError(RequestException):
      def __init__(self, message, response=None):
          super().__init__(message)
          self.response = response


  class ConnectionError(RequestException):
      pass


  class Response:
      def __init__(self, url, status_code=200, text="", content_type="text/plain; charset=utf-8"):
          self.url = url
          self.status_code = status_code
          self.text = text
          self.headers = {"Content-Type": content_type, "Content-Length": str(len(text.encode("utf-8")))}

      @property
      def content(self):
          return self.text.encode("utf-8")

      @property
      def ok(self):
          return self.status_code < 400

      def json(self):
          return _json.loads(self.text)

      def raise_for_status(self):
          if self.status_code >= 400:
              raise HTTPError(f"{self.status_code} Error for url: {self.url}", response=self)

      def __repr__(self):
          return f"<Response [{self.status_code}]>"


  BOOK = """The Project Gutenberg eBook of Pride and Prejudice, by Jane Austen

  Chapter 1

  It is a truth universally acknowledged, that a single man in possession
  of a good fortune, must be in want of a wife.

  However little known the feelings or views of such a man may be on his
  first entering a neighbourhood, this truth is so well fixed in the minds
  of the surrounding families, that he is considered the rightful property
  of some one or other of their daughters.

  "My dear Mr. Bennet," said his lady to him one day, "have you heard that
  Netherfield Park is let at last?"

  Mr. Bennet replied that he had not.

  "But it is," returned she; "for Mrs. Long has just been here, and she
  told me all about it."

  Mr. Bennet made no answer.

  "Do you not want to know who has taken it?" cried his wife impatiently.

  "You want to tell me, and I have no objection to hearing it."

  This was invitation enough.
  """

  SALES = [
      {"machine": 1, "item": "candy", "price": 0.5},
      {"machine": 1, "item": "chocolate", "price": 1.5},
      {"machine": 2, "item": "cookie", "price": 1.0},
      {"machine": 3, "item": "soda", "price": 1.2},
      {"machine": 3, "item": "cake", "price": 2.0},
      {"machine": 1, "item": "chocolate", "price": 1.5},
      {"machine": 2, "item": "soda", "price": 1.2},
      {"machine": 2, "item": "cookie", "price": 1.0},
      {"machine": 1, "item": "candy", "price": 0.5},
      {"machine": 3, "item": "soda", "price": 1.2},
      {"machine": 1, "item": "gums", "price": 0.8},
      {"machine": 2, "item": "cookie", "price": 1.0},
  ]


  def _initial_machines():
      return {
          1: {"id": 1, "location": "hall", "items": {"candy": 3, "chocolate": 5, "gums": 0}},
          2: {"id": 2, "location": "library", "items": {"cookie": 4, "soda": 2}},
          3: {"id": 3, "location": "gym", "items": {"soda": 6, "cake": 1}},
      }


  class Session:
      """Same use as requests.Session(): session.get(url, params=...), session.post(url, json=...)."""

      def __init__(self):
          self.machines = _initial_machines()
          self.history = []          # requests sent: (method, url)
          self._flaky_calls = 0

      def get(self, url, params=None, timeout=None):
          return self.request("GET", url, params=params)

      def post(self, url, data=None, json=None, params=None, timeout=None):
          return self.request("POST", url, params=params, body=json if json is not None else data)

      def request(self, method, url, params=None, body=None):
          if params:
              url = url + ("&" if "?" in url else "?") + urlencode(params)
          self.history.append((method, url))
          parts = urlparse(url)
          if parts.scheme not in ("http", "https"):
              raise ConnectionError(f"unsupported scheme: {url}")
          base = f"{parts.scheme}://{parts.netloc}"
          if base == API:
              query = {key: values[0] for key, values in parse_qs(parts.query).items()}
              segments = [s for s in parts.path.split("/") if s]
              return self._api(method, url, segments, query, body or {})
          if url.split("?")[0] == BOOK_URL and method == "GET":
              return Response(url, 200, BOOK)
          if base == "https://flaky.example":
              self._flaky_calls += 1
              if self._flaky_calls <= 2:
                  return Response(url, 503, "Service Unavailable")
              return Response(url, 200, "OK")
          if parts.netloc.endswith(".example") or parts.netloc == "www.gutenberg.org":
              return Response(url, 404, "Not Found")
          raise ConnectionError(f"fakeweb cannot reach {parts.netloc} (offline Internet)")

      @staticmethod
      def _json(url, status, value):
          return Response(url, status, _json.dumps(value), "application/json")

      def _api(self, method, url, segments, query, body):
          if segments == ["machines"] and method == "GET":
              return self._json(url, 200, list(self.machines.values()))
          if segments == ["sales"] and method == "GET":
              page, size = int(query.get("page", 1)), 5
              return self._json(url, 200, {"page": page, "sales": SALES[(page - 1) * size:page * size]})
          if len(segments) >= 2 and segments[0] == "machines":
              try:
                  machine = self.machines[int(segments[1])]
              except (ValueError, KeyError):
                  return self._json(url, 404, {"error": "unknown machine"})
              if len(segments) == 2 and method == "GET":
                  return self._json(url, 200, machine)
              if segments[2:] == ["buy"] and method == "POST":
                  item = body.get("item")
                  if item not in machine["items"]:
                      return self._json(url, 404, {"error": f"unknown item: {item}"})
                  if machine["items"][item] == 0:
                      return self._json(url, 409, {"error": f"{item} is sold out"})
                  machine["items"][item] -= 1
                  return self._json(url, 200, {"ok": True, "item": item, "remaining": machine["items"][item]})
          return self._json(url, 404, {"error": "not found"})


  def get(url, params=None, timeout=None):
      return Session().get(url, params=params)


  def post(url, data=None, json=None, timeout=None):
      return Session().post(url, data=data, json=json)
`;

/** La classe VendingMachine de la séance 5, version simplifiée pour le serveur web. */
export const MACHINE_PY = py`
  """VendingMachine from session 5, simplified for the web server."""
  import pickle


  class VendingMachine:
      MAX_QUANTITY = 10

      def __init__(self):
          # name -> [price, quantity]
          self.products = {"candy": [0.5, 3], "chocolate": [1.5, 10], "gums": [0.8, 0]}
          self.profit = 0.0

      def buy(self, item):
          """Buys one item. KeyError if unknown, ValueError if sold out. Returns the price."""
          if item not in self.products:
              raise KeyError(item)
          price, quantity = self.products[item]
          if quantity == 0:
              raise ValueError(f"{item} is sold out")
          self.products[item][1] -= 1
          self.profit += price
          return price

      def refill(self):
          for product in self.products.values():
              product[1] = self.MAX_QUANTITY

      def to_order(self):
          """What should be ordered to refill the machine: [[name, quantity], ...]."""
          return [
              [name, self.MAX_QUANTITY - quantity]
              for name, (price, quantity) in self.products.items()
              if quantity < self.MAX_QUANTITY
          ]

      def dumps(self, path):
          with open(path, "wb") as f:
              pickle.dump((self.products, self.profit), f)

      def loads(self, path):
          with open(path, "rb") as f:
              self.products, self.profit = pickle.load(f)
`;

export const MACHINE_HTML = `<!doctype html>
<html>
  <head><title>Web Vending Machine</title></head>
  <body>
    <h1>Web Vending Machine</h1>
    <ul>
    {% for name, (price, quantity) in products.items() %}
      <li>{{ name }}: {{ "%.2f"|format(price) }} ({{ quantity }} left) <a href="/buy/{{ name }}">buy</a></li>
    {% endfor %}
    </ul>
    <p>Profit: {{ "%.2f"|format(profit) }}</p>
  </body>
</html>
`;
