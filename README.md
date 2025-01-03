# Port

A simple, lightweight and fast web framework for building modern web applications.

## Features

- **Simple**: Port is simple to use, with a simple API and a simple way to build
- **Lightweight**: Port is lightweight, with no dependencies other than the Go standard
library and a few other libraries
- **Fast**: Port is built on top of the `http` module, which is the fastest one
of the fastest in the Go ecosystem.
- **PPR**: Port is a PPR (Partial Page Rendering) framework, which allows the user to
determine which parts of the page will take longer to load and stream the rest of the
page to the user while the server is processing the slow part.

## TODO List

- [x] Make streaming API better
- [ ] Persistant layouts
- [ ] Static HTML
generation for better page loads
- [ ] Caching in general, `fetch()` and functions call on the server with some
deduplication
- [ ] Mutations on the server should be able to be streamed to the client the HTML
