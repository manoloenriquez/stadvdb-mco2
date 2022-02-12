import useSWR from 'swr'

export default function Home() {

  const { data, error } = useSWR('/api/case1', async url => await fetch(url).then(data => data.json()))

  if (!data) return <h3>Loading...</h3>

  return (
    <div className="container p-3">
      {/* Case 1 */}
      <h2>Case 1</h2>
      <div className="d-flex flex-wrap gap-5 border rounded p-4">
        <div className="flex-fill">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Year</th>
                <th>Ranking</th>
              </tr>
            </thead>
            <tbody>
              {data.map(movie => (
                <tr key={movie.movie_id}>
                  <td>{movie.movie_id}</td>
                  <td>{movie.movie_name}</td>
                  <td>{movie.movie_year}</td>
                  <td>{movie.movie_ranking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
