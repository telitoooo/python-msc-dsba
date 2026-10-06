### Three ways to send an HTTP request

1. **With a web browser**: typing a URL sends a `GET` request (a form often sends a `POST` with its data). The browser does the DNS resolution, adds the port based on the protocol and **renders** the response.
2. **On the command line**: `wget` and `curl` download a resource without rendering it: they return the raw HTML text. `curl` makes it easy to send `POST` requests with data: handy to **test a server**.

```text
$ wget https://github.com/tensorflow/tensorflow
Resolving github.com (github.com)... 140.82.118.3
Connecting to github.com (github.com)|140.82.118.3|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: 'tensorflow'

$ curl -X POST -d "item=candy" http://localhost:5000/buy
```

3. **In Python**, with the **`requests`** package (to install: `pip install requests`).

### The `requests` package

```python norun
import requests

url = "https://en.wikipedia.org/wiki/Abraham_Lincoln"
resp = requests.get(url, timeout=10)
print("Response", resp.status_code)                       # 200
print("Size {:.2f}MB".format(len(resp.content) / 2**20))  # content: bytes; text: decoded text
print(resp.headers["Content-Type"])
with open("lincoln.html", "w", encoding="utf-8") as fp:   # save the page
    fp.write(resp.text)
```

| Element | Role |
|---|---|
| `requests.get(url, params={…})` | GET request; `params` builds the *query* (`?q=…&page=…`) |
| `requests.post(url, data={…})` / `json={…}` | POST request with form data / a JSON body |
| `resp.status_code`, `resp.ok` | status code; `ok` is `True` if the code is < 400 |
| `resp.text`, `resp.content` | response body as text / as bytes |
| `resp.json()` | deserializes a JSON body into a Python object (dict, list…) |
| `resp.headers` | response headers (dictionary) |
| `resp.raise_for_status()` | raises `requests.HTTPError` if the code is an error (4xx, 5xx) |
| `requests.get(url, stream=True)` + `resp.iter_content(…)` | receive a big content chunk by chunk |

```python norun
import requests

resp = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
resp.raise_for_status()                    # stops here on a 4xx / 5xx error
repo = resp.json()                         # JSON → Python dictionary
print(repo["full_name"], repo["stargazers_count"])

resp = requests.post("https://httpbin.org/post", json={"item": "candy"}, timeout=10)
print(resp.status_code, resp.json()["json"])
```

### Anatomy of a program that queries the web

The first program of the course (session 1) fetches the New York Times headlines. It combines `requests` and **BeautifulSoup** (`pip install requests beautifulsoup4`), which parses HTML:

```python norun
import requests
from bs4 import BeautifulSoup


def get_nyt_headlines():
    url = "https://www.nytimes.com"
    try:
        response = requests.get(url)              # sends a GET request
        response.raise_for_status()
        # Parse the HTML content of the page using BeautifulSoup
        soup = BeautifulSoup(response.content, "html.parser")
        # Find the headline elements (inspect the page source to choose)
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

> ⚠️ **In the browser**, Python cannot freely query any website: for security, browsers block requests to a site other than the page's own (**CORS** policy). The exercises therefore use `fakeweb.py`, an imitation of `requests` with **exactly the same interface** (`Session().get`, `.post`, `status_code`, `json()`, `raise_for_status()`…), which answers from a small offline Internet. On your computer, just replace `fakeweb` with `requests`.

### Handling a JSON response

What really matters is what you do with the data you receive:

```python
import json
from urllib.parse import urlencode

base = "https://api.vending.example/sales"
print(base + "?" + urlencode({"machine": "hall", "page": 2}))   # the URL that params=… would send

body = '{"page": 2, "sales": [{"item": "candy", "price": 0.5}, {"item": "cake", "price": 2.0}]}'
data = json.loads(body)                                        # what resp.json() does
total = sum(sale["price"] for sale in data["sales"])
print(f"page {data['page']}: {len(data['sales'])} sales, total {total:.2f}")
```

> 🎯 **Key points**: browser, `wget` / `curl` or `requests`; `requests.get(url, params=…)`, `requests.post(url, data=… / json=…)`; `status_code`, `text`, `content`, `json()`, `headers`, `raise_for_status()`; handle `requests.exceptions.RequestException`; BeautifulSoup to parse HTML.
