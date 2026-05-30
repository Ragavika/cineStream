import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
