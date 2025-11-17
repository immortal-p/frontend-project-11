# Frontend Project 11 — RSS Aggregator

### Hexlet Tests and Linter Status

[![Actions Status](https://github.com/immortal-p/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/immortal-p/frontend-project-11/actions)

### Demo

**[RSS Demo](https://frontend-project-11-three-azure.vercel.app/)**

---

## Overview

This project is an **RSS Aggregator** that allows users to subscribe to RSS feeds, parse and display articles, and automatically update the content in real time. It validates URLs, handles errors, organizes posts, and highlights unread/read articles.

---

## Features

* Add RSS feed links
* Validate user input and handle errors
* Parse RSS XML into structured data
* Automatically refresh feeds and fetch new posts
* View list of posts and feed info
* Highlight unread posts
* Open post preview in a modal window
* Multilingual support (i18n)

---

## Requirements

Before installation, make sure you have:

* Node.js (v14+)
* npm or yarn
* Make (optional, if using Makefile)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/immortal-p/frontend-project-11.git
cd frontend-project-11
```

2. Install dependencies:

```bash
make install
```

(or `npm install` if Makefile is not used)

---

## Running the Project

### Development mode

```bash
make dev
```

(or `npm run dev`)

### Production build

```bash
make build
```

(or `npm run build`)

### Start the application

```bash
make start
```

Your application will run at:
👉 [http://localhost:8080](http://localhost:8080) (or your configured port)

---

## How It Works

1. The user enters a valid RSS feed URL.
2. The application checks:

   * URL format
   * URL accessibility
   * Whether it's already added
3. If valid, the RSS feed is downloaded and parsed.
4. Feed metadata and posts are displayed.
5. The application polls feeds periodically to fetch new posts.
6. New posts are added to the UI without page reload.
7. When clicking a post:

   * It is marked as "read"
   * A preview modal opens

---

## Testing & Linting

Run linter:

```bash
make lint
```

Run tests:

```bash
make test
```

---

## Tech Stack

* JavaScript (ES6+)
* Webpack
* Axios (HTTP requests)
* i18next (localization)
* Yup (validation)
* Bootstrap (UI)
* Jest (testing)

---

## Project Structure

```
frontend-project-11/
├── src/
│   ├── css/
│   ├── locales/
│   ├── app.js
│   ├── index.js
│   └── view.js
├── Makefile
├── package.json
├── versel.json
└── vite.config.js
```

---

## Deployment

To deploy your project:

1. Run production build: `make build`
2. Upload the `dist` or `build` folder to hosting (Vercel, Netlify, Render, etc.)
3. Configure CI/CD (optional)

---

## Credits

Project created as part of the **Hexlet Frontend Developer Program**.

---

## License

This project is distributed under the MIT License.
