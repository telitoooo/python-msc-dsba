### Definition

From Wikipedia: *“A Uniform Resource Locator (URL), colloquially termed a web address, is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it.”* To see a web page, you must say **exactly** which computer it is on and which one you want:

```text
URL = scheme://username:password@host:port/path?query#fragment
```

### The parts of a URL

| Part | Role | Example |
|---|---|---|
| **scheme** (protocol) | how to formulate the request, what kind of response to expect | `http` (web pages), `https` (same, encrypted), `ftp` (file transfer), `file` (local file), `mailto` (email) |
| **username:password** | credentials; rarely used on the web, rather to connect to a database | `postgres://ada:secret@db.example.com/sales` |
| **host** | the network machine holding the resource: domain name, subdomain or IP address | `www.google.com`, `176.159.37.246` |
| **port** | the server program to talk to on this machine; often implicit | `:5000` |
| **path** | the requested functionality, the **route**; the server maps each route to a function, the **handler** | `/search` |
| **query** | the **arguments** of the handler: `name=value`, separated by `&` | `q=ip+address&hl=fr` |
| **fragment** | a part of the document to move the view to; **not sent to the server** | `#The_Civil_War` |

The most common implicit ports: **80** (HTTP), **443** (HTTPS), 22 (SSH), 25 / 465 (SMTP / SMTPS, email), 53 (DNS), 3306 (MySQL), 27017 (MongoDB), 6379 (Redis). On the Internet, your ISP usually gives you an IP address for 24 hours.

### Example: a Google search

`https://www.google.com/search?q=ip+address` means: we talk to Google's server using `https`; the host is `www.google.com`, port **443** by default; we request a search (path `/search`); the parameter `q` is `"ip address"`.

> ⚠️ A URL cannot contain just any character: values are **encoded** (*escaped*). A space becomes `+` (or `%20`), `é` becomes `%C3%A9`, `&` becomes `%26`…

### The fragment is not sent

For `https://en.wikipedia.org/wiki/Abraham_Lincoln#The_Civil_War`, the browser only sends:

```text
Request URL: https://en.wikipedia.org/wiki/Abraham_Lincoln
Request Method: GET
Remote Address: 91.198.174.192:443
```

then scrolls the page by itself to the `The_Civil_War` section.

### Splitting a URL in Python: `urllib.parse`

```python
from urllib.parse import parse_qs, quote_plus, unquote_plus, urlencode, urljoin, urlparse

url = "https://ada:secret@www.example.com:8080/search/results?q=ip+address&page=2#top"
parts = urlparse(url)
print(parts.scheme, parts.username, parts.password)
print(parts.hostname, parts.port, parts.path)
print(parts.query, "→", parse_qs(parts.query))    # dictionary of lists of values
print(parts.fragment)

print(urlparse("https://www.google.com/search?q=ip+address").port)   # None: implicit port (443)

print(quote_plus("café & croissants"))            # encode a value
print(unquote_plus("caf%C3%A9+%26+croissants"))   # decode
print(urlencode({"q": "ip address", "page": 2}))  # build a query
print(urljoin("https://www.example.com/wiki/Python", "Guido"))   # relative URL → absolute
```

> 🎯 **Key points**: `scheme://user:password@host:port/path?query#fragment`; the port is often implicit (80 / 443); the path is the route to a handler, the query its arguments (`&`, encoded values: space → `+`); the fragment stays in the browser; `urllib.parse`: `urlparse`, `parse_qs`, `urlencode`, `quote_plus`.
