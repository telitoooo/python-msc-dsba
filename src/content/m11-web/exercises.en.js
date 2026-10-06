import { md } from "../helpers.js";

export default {
  "m11-l1": {
    ex1: {
      title: "HTTP by hand",
      core: {
        title: "Reading an HTTP request",
        prompt: md`
          An HTTP request is plain text: a request line (\`method path version\`), header lines \`Name: value\`, an empty
          line, then an optional body. Lines are separated by \`"\\r\\n"\`.

          Write \`parse_request(raw)\`, which returns a dictionary:
          \`{"method": …, "path": …, "version": …, "headers": {name: value, …}, "body": …}\`.
          Test it on \`RAW\`, the request sent by the browser for \`https://github.com/tensorflow/tensorflow\`.
        `,
        hint: md`
          \`raw.partition("\\r\\n\\r\\n")\` separates the head from the body. Then \`head.split("\\r\\n")\`: the first line is
          the request line, the next ones are the headers (\`line.split(": ", 1)\` splits at the first \`": "\`).
        `,
        tests: [
          "Method, path and version",
          "Headers form a dictionary",
          "The body is empty for a GET",
          "A POST request with a body",
        ],
      },
      extra: {
        title: "Building and reading a response",
        prompt: md`
          1. \`make_response(status, body, content_type="text/html; charset=utf-8")\` builds the HTTP response: status line
             \`HTTP/1.1 <code> <text>\` (texts in \`STATUS\`), headers \`Content-Type\` and \`Content-Length\` (size of the
             body **in UTF-8 bytes**: \`len(body.encode("utf-8"))\`), empty line, body.
          2. \`parse_response(raw)\` does the opposite: returns \`(code (int), headers (dict), body)\`.
          3. \`api_response(data)\` returns a 200 response whose body is \`data\` serialized as JSON, with the type
             \`application/json\`.
        `,
        tests: [
          "`make_response(200, \"<h1>Hi</h1>\")` exactly",
          "`Content-Length` counts bytes (“café” = 5)",
          "`parse_response` returns code, headers and body",
          "`api_response` serializes to JSON",
        ],
      },
      stretch: {
        title: "A mini server without network",
        prompt: md`
          \`parse_request\` and \`make_response\` are provided. Write the heart of a web server: \`handle(raw_request, routes)\`
          receives the **text** of a request and returns the **text** of the response.

          - if the method is not \`GET\` → \`405\`, body \`"Method Not Allowed"\`;
          - the path may contain a *query* (\`/price?item=candy\`): split them, and turn the query into a dictionary
            \`{name: value}\` (\`parse_qs\`, keeping the first value);
          - if the path is not in \`routes\` → \`404\`, body \`"Not Found"\`;
          - otherwise, call the **handler** \`routes[path](query)\`: if it returns a string → \`200\` as HTML; if it returns
            a dictionary or a list → \`200\` as JSON (\`application/json\`).

          Then define the vending machine's three handlers: \`home\` (an HTML page containing
          \`<h1>Vending machine</h1>\`), \`machine_state\` (returns \`STOCK\`) and \`price\` (returns
          \`{"item": …, "price": …}\` for the item \`query["item"]\`), and the \`routes\` dictionary.
        `,
        tests: [
          "`GET /` returns the home page as HTML",
          "`GET /machine` returns the stock as JSON",
          "`GET /price?item=chocolate` uses the query",
          "Unknown path → 404",
          "Method other than GET → 405",
        ],
      },
    },
  },

  "m11-l2": {
    ex1: {
      title: "Anatomy of a URL",
      core: {
        title: "Dissecting a URL with urllib.parse",
        prompt: md`
          Write \`describe_url(url)\`, which returns a dictionary \`{"scheme", "host", "port", "path", "query", "fragment"}\`
          using \`urllib.parse\`:

          - \`host\`: the bare host name (without credentials or port: \`parts.hostname\`);
          - \`port\`: the port written in the URL, otherwise the protocol's **default** port (\`DEFAULT_PORTS\`);
          - \`path\`: \`"/"\` if the URL has no path;
          - \`query\`: a dictionary \`name → value\` (first value of \`parse_qs\`, hence decoded: \`+\` → space);
          - \`fragment\`: empty string if there is none.
        `,
        tests: [
          "The Google search",
          "Explicit port: localhost:5000",
          "The Wikipedia fragment",
          "Credentials excluded from the host, default FTP port",
          "Several parameters",
          "A URL without a path",
        ],
      },
      extra: {
        title: "Same thing, by hand",
        prompt: md`
          Write \`split_url(url)\`, which returns **the same dictionary** as \`describe_url\` (provided, with urllib), but
          **without** \`urlparse\` or \`parse_qs\`: string methods only (\`partition\`, \`split\`, \`replace\`…). Assume that
          query values only contain letters, digits and \`+\` (which encode spaces).
        `,
        hint: md`
          Split in this order: \`url.partition("#")\` (fragment), \`partition("?")\` (query), \`partition("://")\` (scheme),
          then the first \`"/"\` separates the “authority” \`user:password@host:port\` from the path. In the authority, keep
          what follows the last \`"@"\`, then split \`host\` and \`port\` with \`":"\`.
        `,
        tests: [
          "Same as `describe_url` on the 5 URLs",
          "And on other URLs",
          "No `urlparse` nor `parse_qs` in `split_url`",
        ],
      },
      stretch: {
        title: "Building a URL and the browser's request",
        prompt: md`
          1. \`build_url(scheme, host, path="/", params=None, port=None, fragment=None)\` assembles a URL: the port is only
             written if it differs from the protocol's default port; parameters are encoded with \`urlencode\`
             (space → \`+\`); the fragment is appended after \`#\`.
          2. \`request_for(url)\` returns the **beginning of the request** the browser sends for this URL:
             \`"GET <path>?<query> HTTP/1.1\\r\\nHost: <host>\\r\\n\\r\\n"\`. The path is \`/\` if empty, the query only appears
             if it exists, the \`Host\` header contains the port if it is not the default one… and the **fragment is never sent**.
        `,
        tests: [
          "The Google search",
          "Default port omitted, special port written, fragment appended",
          "The fragment is not sent to the server",
          "Query kept, non-standard port in `Host`, empty path → `/`",
        ],
      },
    },
  },

  "m11-l3": {
    ex1: {
      title: "Making HTTP requests",
      core: {
        title: "Querying the vending machines API",
        prompt: md`
          \`fakeweb\` (working folder) is used **exactly like** \`requests\`: \`session = fakeweb.Session()\`, then
          \`session.get(url)\`. The vending machines API lives at \`fakeweb.API\`.

          1. \`response\`: the response to \`GET <API>/machines\`; \`status\`: its code; \`machines\`: the deserialized JSON
             body (a list of dictionaries); \`locations\`: the list of locations.
          2. \`get_machine(session, machine_id)\`: the machine's dictionary (\`GET <API>/machines/<id>\`), or \`None\` if it
             does not exist. Use \`raise_for_status()\` and catch \`fakeweb.HTTPError\`.
          3. \`available_items(session, machine_id)\`: the **sorted** list of items in stock (quantity > 0) of this machine,
             or \`[]\` if it does not exist.
        `,
        tests: [
          "`status` is 200",
          "`machines`: 3 deserialized machines",
          "`locations`",
          "`get_machine` returns the machine, or `None` (404)",
          "`raise_for_status` is used",
          "`available_items`",
        ],
      },
      extra: {
        title: "Book word statistics",
        prompt: md`
          *Hands-on “Book Words Statistics” (session 3).*

          1. Download the book at \`fakeweb.BOOK_URL\` (an excerpt of *Pride and Prejudice* from Project Gutenberg) and
             save its text to \`pride.txt\`.
          2. \`words(text)\`: the list of lower-case words, punctuation ignored (\`re.findall(r"[a-z]+", …)\`).
          3. \`count_words(word_list)\`: a \`collections.Counter\` of the number of occurrences of each word.
          4. \`save_counts(counts, path)\`: writes one line \`"word count"\` per word, from most to least frequent (ties:
             alphabetical order).
          5. \`top10\`: the 10 most frequent words of the book, as a list of tuples \`(word, count)\` in the same order;
             also write the full ranking to \`counts.txt\`.
        `,
        hint: md`
          Sort key: \`sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))\`.
        `,
        tests: [
          "`pride.txt` contains the downloaded book",
          "`words` ignores punctuation and capital letters",
          "`count_words` returns a Counter",
          "`top10`: the most frequent words",
          "`counts.txt`: one “word count” line per word, sorted",
        ],
      },
      stretch: {
        title: "POST, pagination and retries",
        prompt: md`
          1. \`buy(session, machine_id, item)\`: sends a \`POST\` to \`<API>/machines/<id>/buy\` with the JSON body
             \`{"item": item}\` (\`json=…\`) and returns the remaining quantity (\`"remaining"\`). Code 409 (sold out) → raises
             \`ValueError\`; 404 (unknown machine or item) → raises \`KeyError\`.
          2. \`all_sales(session)\`: the API returns sales **in pages** of 5 (\`GET <API>/sales\` with
             \`params={"page": n}\`). Fetch pages 1, 2, 3… until an empty page and return the list of all sales.
          3. \`get_with_retry(session, url, attempts=3)\`: sends a \`GET\` and **retries** as long as the server answers a
             5xx error, at most \`attempts\` times in total. Returns the successful response; if all attempts fail, raises
             the error with \`raise_for_status()\`. (\`https://flaky.example/status\` answers 503 twice, then 200.)
        `,
        tests: [
          "`buy` returns the remaining quantity",
          "`buy` really sends a JSON POST",
          "Sold out → `ValueError`, unknown → `KeyError`",
          "`all_sales` goes through the pages until the empty one",
          "`get_with_retry` ends up succeeding (3 attempts)",
          "Too few attempts → `HTTPError`",
        ],
      },
    },
  },

  "m11-l4": {
    ex1: {
      title: "A web server with Flask",
      core: {
        title: "First routes",
        prompt: md`
          Create a Flask application \`app\` with three routes:

          - \`/\` → \`"Hello world!"\`;
          - \`/custom/<name>\` → \`"Hello <name>"\`;
          - \`/square/<int:n>\` → the JSON \`{"n": n, "square": n²}\` (\`flask.jsonify\`).

          Test them with \`client = app.test_client()\` (\`client.get("/")\`…), and end with the server launch protected by
          \`if __name__ == "__main__":\` (\`app.run(port=5000)\`, simulated in the browser).
        `,
        tests: [
          "`app` is a Flask application",
          "`/` → `Hello world!`",
          "`/custom/<name>`",
          "`/square/<int:n>` returns JSON",
          "The server is started under `if __name__ == \"__main__\":`",
        ],
      },
      extra: {
        title: "The online vending machine",
        prompt: md`
          *Exercise “Vending Machines again as a web server”.* The \`VendingMachine\` class (\`machine.py\`) and the template
          \`templates/machine.html\` are provided. With \`machine = VendingMachine()\`:

          1. \`/\` shows the content of the machine: \`render_template("machine.html", products=…, profit=…)\`;
          2. \`/buy/<item>\` buys the item then **redirects** to \`/\` (\`flask.redirect\`, code 302); unknown item →
             \`("unknown item", 404)\`; sold out → \`("sold out", 409)\`;
          3. \`/refill\` refills the machine then redirects to \`/\`;
          4. \`/order\` returns as JSON what must be ordered (\`machine.to_order()\`: a list of lists).
        `,
        tests: [
          "`/` displays the template page with the products",
          "`/buy/chocolate` buys then redirects to `/`",
          "Sold-out item → 409, unknown → 404",
          "`/order` returns the order list as JSON",
          "`/refill` refills the machine then redirects",
        ],
      },
      stretch: {
        title: "Persistence and sales log",
        prompt: md`
          *Bonus questions from the course.* When you kill the server and start it again, the machine is full again. Write
          an **application factory** \`create_app(state_path="machine.pickle", log_path="sales.log")\`:

          1. it creates a \`VendingMachine\` and, if \`state_path\` exists, reloads its state (\`machine.loads\`);
          2. \`GET /\` returns as JSON \`{"products": …, "profit": …}\` (profit rounded to 2 decimals);
          3. \`POST /buy\` (form field \`item\`) buys the item, **appends** a line \`"item,price"\` (price with 2 decimals) to
             \`log_path\`, saves the state (\`machine.dumps\`) and redirects to \`/\`; errors: 404 (unknown) and 409 (sold
             out). A \`GET /buy\` must be refused (405).

          Where should \`loads\` and \`dumps\` be called so that the server always gets back its last state?
        `,
        tests: [
          "`POST /buy` buys and redirects",
          "Each sale is appended to the log",
          "A new server gets back the saved state",
          "Errors 404 / 409 / 405",
          "Errors are not logged",
        ],
      },
    },
  },
};
