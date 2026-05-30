export default function MovieCard({ movie }) {
  return (
    <div className="card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p>{new Date(movie.release_date).getFullYear()}</p>
      <p>⭐ {movie.vote_average}</p>
    </div>
  );
}
