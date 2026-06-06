import MovieCard from "./MovieCard";

export default function MovieGrid({ movies = [] }) {
  const safeMovies = Array.isArray(movies) ? movies : [];
  return (
    <div className="grid grid-cols-4 gap-4">
      {safeMovies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
