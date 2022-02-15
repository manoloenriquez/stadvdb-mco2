import type { Movie, Director, Actor, Role } from '../lib/types'
import axios from 'axios'

interface Props {
  movies?: Array<Movie>
  directors?: Array<Director>
  actors?: Array<Actor>
  roles?: Array<Role>
  isolation: string
}

export default function Table({ movies, directors, actors, roles, isolation }: Props) {
  const delMovie = (id: number) => {
    // axios.delete('/api/movies', {
    //   data: {
    //     id: id,
    //     isolation: isolation
    //   }
    // })
  }

  return (
    <div className="table-container">
      <table className="table table-bordered px-3 table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Year</th>
            <th>Ranking</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.movie_id}>
              <td>{movie.movie_id}</td>
              <td>{movie.movie_name}</td>
              <td>{movie.movie_year}</td>
              <td>{movie.movie_ranking}</td>
              <td>
                <button className="btn btn-primary">
                  Edit
                </button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => delMovie(movie.movie_id)}>
                  Delete
                </button>
              </td>
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