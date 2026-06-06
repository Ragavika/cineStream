export default function MovieCard({ movie }) {
  return (
    <div className="card">
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</p>
      <p>⭐ {movie.vote_average || "N/A"}</p>
    </div>
  );
}
