import type { Movie, Director } from '../lib/types'
interface Props {
  movies?: Array<Movie>
  directors?: Array<Director>
  isolation: string
}

export default function Table({ movies, directors, isolation }: Props) {
  return (
    <div className="table-container">
      <table className="table table-bordered px-3 table-hover">
        <thead>
          {movies ? (
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Year</th>
              <th>Ranking</th>
            </tr>
          ) : directors ? (
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          ) : (
            <tr></tr>
          )}
        </thead>
        <tbody>
          {movies ? movies.map(movie => (
            <tr key={movie.movie_id}>
              <td>{movie.movie_id}</td>
              <td>{movie.movie_name}</td>
              <td>{movie.movie_year}</td>
              <td>{movie.movie_ranking}</td>
            </tr>
          )) : directors ? directors.map(director => (
            <tr key={director.director_id}>
              <td>{director.director_id}</td>
              <td>{director.director_first_name}</td>
              <td>{director.director_last_name}</td>
            </tr>
          )) : (
            <tr></tr>
          )}
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