### Why the web?

In module 7 we wrote a `VendingMachine` class. To be really useful, the vending machine program should **run forever** and be **reachable remotely** (check its state, its sales, order a product from a phone). A program that never stops and can be reached over the network is called a **server**. On the Internet, it is usually an **HTTP server**, which follows a precise **protocol**:

- how to ask it something: the **HTTP request**;
- what to expect in return: the **HTTP response**.

“Server” refers both to the computer and to the program running on it. In Python you can easily **query** servers (lesson 11.3) and **write** them (lesson 11.4).

### Life of an HTTP request

What happens when you type `https://github.com/tensorflow/tensorflow` in a browser?

1. The **Internet** is a huge network of computers. Your computer is not directly connected to it: it goes through an **Internet service provider** (ISP), itself connected to the network.
2. Each machine is identified by an **IP address** (for instance `140.82.118.4`), like a postal address.
3. The **URL** gives the **protocol** (`https`), the **host** (`github.com`) and the requested **resource** (`/tensorflow/tensorflow`) (details in lesson 11.2).
4. **DNS resolution**: we only know the *name* `github.com`. The ISP keeps a table domain name → IP address; if it does not know the name, it recursively asks other DNS servers.
5. **Port**: the machine `140.82.118.4` runs several server programs (website, API, mail, database…). The **port** says which one you talk to; HTTPS servers listen on port **443**, HTTP on port **80**.
6. A **TCP connection** is established between your machine and `140.82.118.4:443`.
7. The **HTTP request** is sent; it is just a **text**:

```text
GET /tensorflow/tensorflow HTTP/1.1
Host: github.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml
Accept-Language: en-US,en;q=0.9,fr;q=0.8
Cookie: ...
```

The first line holds the **method** (`GET` to read, `POST` to send form data, `PUT`, `DELETE`…), the **path** and the protocol version; then come the **headers**, then an empty line and possibly a **body**.

8. The server sends back an **HTTP response**, also a text: a **status** line, headers, an empty line, then the content (here the HTML of the page):

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

9. A big response (image, video) is split into **packets**, which may take different routes; the client **reassembles** them.
10. The browser **renders** the HTML. Meanwhile it sends other requests: images, style sheets, and **AJAX** requests (asynchronous requests sent by the page's JavaScript).

| Status code | Meaning |
|---|---|
| `200 OK` | success |
| `301` / `302` | redirection to another address (`Location` header) |
| `400 Bad Request` | malformed request |
| `403 Forbidden` / `404 Not Found` | access denied / resource not found |
| `405 Method Not Allowed` | method not accepted on this path |
| `500 Internal Server Error` / `503 Service Unavailable` | server error / unavailability |

### Data rather than pages: serialization

An **API** server does not return an HTML page but **data**… which must still travel as text. Turning data into text is called **serialization** (module 5). **JSON** is the most common format; Python also provides `pickle` (binary, Python-specific).

```python
import json

machine = {"id": 3, "location": "hall", "items": {"candy": 4, "gums": 0}, "online": True}
body = json.dumps(machine)                 # what the server puts in the response
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
headers, _, content = rest.partition("\r\n\r\n")   # an empty line separates headers and body
print(status_line.split()[1], json.loads(content)["items"])
```

### Your computer as a server

Your own machine always has the address `127.0.0.1`, named `localhost`. Python ships a small ready-to-use web server that serves the files of the current folder (run it in a terminal, then open <http://localhost:8000>):

```text
C:\Users\me> python -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
::1 - - [12/Sep/2022 11:02:59] "GET / HTTP/1.1" 200 -
```

> 💡 Open your browser's developer tools (F12, *Network* tab): you will see every request, its headers and the response.

> 🎯 **Key points**: client → HTTP request (method, path, headers, body) → server → response (status, headers, body); IP, DNS (name → IP), port (443 for HTTPS), TCP, packets; codes 200, 301/302, 404, 500; an API returns serialized data (JSON); `localhost` = `127.0.0.1`.
