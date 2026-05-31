Cine‑Stream

A lightweight movie discovery web application built with **React + Vite**, powered by the **TMDB API**.

---

Features
- Browse **popular movies** on load
- **Search bar** to find movies by title
- Responsive **movie grid** with poster, title, release year, and rating
- Clean UI with footer attribution to TMDB
- Environment variable support for secure API key management

---

Project Structure
```
cine-stream/
├── public/              # Static assets
├── src/
│   ├── api/             # TMDB API helper functions
│   ├── components/      # Reusable UI (MovieCard, MovieGrid, SearchBar)
│   ├── pages/           # Page-level views (Home, SearchResults, MovieDetails)
│   ├── styles/          # CSS files for layout/design
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (API key)
├── package.json
└── vite.config.js
```

---

Setup Instructions
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/cine-stream.git
   cd cine-stream
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

---

Deployment
- Works locally at `http://localhost:5173`
- Deploy easily to **Vercel**:
  - Add `VITE_TMDB_API_KEY` under **Settings → Environment Variables**
  - Redeploy to make the app live

- here is the website 
-    https://cine-stream-beige.vercel.app/
---

Acknowledgements
- [TMDB](https://www.themoviedb.org/) for the movie data API
- React + Vite for the development framework
```

