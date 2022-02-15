import type { Movie, Director, Actor, Role } from '../lib/types'

interface Props {
  movies?: Array<Movie>
  directors?: Array<Director>
  actors?: Array<Actor>
  roles?: Array<Role>
}

export default function Table({ movies, directors, actors, roles }: Props) {
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
          ) : actors ? (
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
            </tr>
          ) : roles ? (
            <tr>
              <th>Director ID</th>
              <th>Movie ID</th>
              <th>Actor ID</th>
              <th>Part</th>
              <th>Genre</th>
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
          )) : actors ? actors.map(actor => (
            <tr key={actor.actor_id}>
              <td>{actor.actor_id}</td>
              <td>{actor.actor_first_name}</td>
              <td>{actor.actor_last_name}</td>
              <td>{actor.actor_gender}</td>
            </tr>
          )) : roles ? roles.map(role => (
            <tr key={role.part}>
              <td>{role.director_id}</td>
              <td>{role.movie_id}</td>
              <td>{role.actor_id}</td>
              <td>{role.part}</td>
              <td>{role.movie_genre}</td>
            </tr>
          )) : (
            <tr></tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          max-height: 500px;
          overflow-y: auto;
          flex: 1;
        }
      `}</style>
    </div>
  )
}