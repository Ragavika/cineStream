import { useEffect, useState } from "react";
import Home from "./pages/Home";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";

function App() {
  const [movies, setMovies] = useState(() => {
    const savedMovies = localStorage.getItem("movies");
    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  return (
    <div className="App">
      <h1>Cine-Stream 🎬</h1>
      <SearchBar setMovies={setMovies} />
      {movies.length > 0 ? <MovieGrid movies={movies} /> : <Home />}
      <footer>
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </footer>
    </div>
  );
}

export default App;
