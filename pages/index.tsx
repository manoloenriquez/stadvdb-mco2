import useSWR from 'swr'

export default function Home() {

  const { data, error } = useSWR('/api/case1', async url => await fetch(url).then(data => data.json()))

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
                <tr>
                  <th>{movie.movie_id}</th>
                  <th>{movie.movie_name}</th>
                  <th>{movie.movie_year}</th>
                  <th>{movie.movie_ranking}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
