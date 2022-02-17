import type { Movie } from '../lib/types'
interface Props {
  movies: Array<Movie>
}

export default function Table({ movies }: Props) {
  return (
    <div className="table-container">
      <table className="table table-bordered px-3 table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Year</th>
            <th>Ranking</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.movie_id}>
              <td>{movie.movie_id}</td>
              <td>{movie.movie_name}</td>
              <td>{movie.movie_year}</td>
              <td>{movie.movie_ranking}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          overflow-y: auto;
          max-width: 700px;
        }
      `}</style>
    </div>
  )
}