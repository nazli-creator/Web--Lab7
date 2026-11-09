# Assignment 7 — Mini Shop (React Router, Context, Zustand)

Run: `npm install` then `npm run dev`.
Demo login: username = student email (`230408018@st.biruni.edu.tr`), password = `demo123456`.

## File organization

```
/lab7
├─ index.html, package.json, vite.config.js, .gitignore
└─ src/
   ├─ api/         productsApi.js, authApi.js        (plain fetch / simulated login, no React)
   ├─ hooks/       useFetch.js, useLocalStorage.js
   ├─ context/     AuthContext.jsx                   (Context + useReducer)
   ├─ store/       cartStore.js                      (Zustand)
   ├─ components/  Layout, NavBar, ProductCard, ProtectedRoute
   ├─ pages/       Home, ProductList, ProductDetail, Cart, Login, NotFound
   ├─ App.jsx      route table
   ├─ main.jsx     BrowserRouter + AuthProvider
   └─ index.css
```

## Reasoning questions

**1. State choices.**
- Signed-in user: React Context + `useReducer` (`AuthContext`), because many distant components need it (NavBar, ProtectedRoute, Login) and it changes rarely.
- Cart: Zustand store (`cartStore.js`), because it changes often and is read by several components.
- Filter values: the URL query string (`useSearchParams`), so a filtered view can be shared, reloaded and bookmarked.
- Product list: local reducer state inside `useFetch`, since it is server data used by the page that fetched it.
- Theme: `useLocalStorage` hook in `Layout`, so the preference survives reloads.

**2. Context versus store.** The user changes rarely, so Context re-rendering all consumers is cheap. The cart changes on every click; with Context every consumer would re-render on each change, even if it only needs the item count or an action. Zustand selectors let a component subscribe to only the slice it needs (NavBar only re-renders when the count changes). Putting the user in Zustand would also work, but gains little; putting the cart in Context would be inefficient.

**3. Custom hooks.** `useFetch` shares the *logic*: the reducer, loading/error/data states, the AbortController and cleanup. It does not share *state*: every call creates its own state, so `ProductList` and `ProductDetail` never see each other's data, and each hook call fetches independently.

**4. Route parameters.** `id` from `useParams` is always a **string**. It mattered in `ProductDetail` when computing the "next product" link (`Number(id) + 1`), and it is passed into the URL of the API request and the `useFetch` dependency list. Cart item ids come from the API as numbers, so I use `product.id` there, not the URL string.

**5. Protected routes.** `ProtectedRoute` runs in the user's browser, so anyone can edit JavaScript/state or call the API directly; it only improves UX. Real security needs a server that verifies credentials/tokens (e.g. session cookie or JWT) on every request for protected data.

**6. Deep links.** On a plain static file server, reloading `/products/3` asks the server for a file at that path, which does not exist, so it returns 404. The Vite dev server has an SPA fallback that serves `index.html` for unknown paths, so React Router can then read the URL. Production hosting needs the same fallback rewrite.

## Self-study notes

- **Updating one query parameter:** `setSearchParams(prev => { const next = new URLSearchParams(prev); next.set(key, value); return next; })` (functional form, from the react-router docs). Copying `prev` keeps the other parameters; empty values are deleted. I used `replace: true` so typing does not spam the history.
- **Safe localStorage initialisation:** read inside `try/catch`, `JSON.parse` the value, and fall back to a default on missing/corrupt data. In `cartStore.js` I also validate that it is an array of well-formed items. Zustand's `store.subscribe` writes items back to localStorage outside React, only when `items` changed.
- **Light/dark theme:** `Layout` puts a `light`/`dark` class on a wrapper div; CSS custom properties (`--bg`, `--text`, ...) are redefined under `.dark`, so background and text colour change everywhere.

## Challenges I faced

- Keeping the other query parameters when changing only one of them.
- Avoiding stored derived state (filtered list, cart total, item count).
- Handling `AbortError` in `useFetch` so cancelled requests do not set state.
- Remembering the original page across the login redirect (location state + `replace`).
