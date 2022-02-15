import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Movie, Director, Actor, Role } from '../lib/types'
import Table from '../components/Table'

const Loading = () => (
  <div className="p-5">
    <h3>Loading...</h3>
  </div>
)

export default function Home() {
  const [ movies, setMovies ] = useState<Array<Movie>>(null)
  const [ offsetM, setOffsetM ] = useState<number>(0)
  const [ isolation, setIsolation ] = useState<string>('READ UNCOMMITTED')

  const [ node1status, setNode1Status ] = useState<boolean>(false)
  const [ node2status, setNode2Status ] = useState<boolean>(false)
  const [ node3status, setNode3Status ] = useState<boolean>(false)

  const QUERY_LIMIT = 10

  const toggleNode = (node: number) => {
    axios.post('/api/nodes', {
      node: node,
    }).then(res => {
      console.log(res.data)
      switch (node) {
        case 1:
          setNode1Status(res.data.result)
          break
        case 2:
          setNode2Status(res.data.result)
          break
        case 3:
          setNode3Status(res.data.result)
      }
    })
  }

  useEffect(() => {
    for (let node = 1; node <= 3; node++) {
      axios.get('/api/nodes', {
        params: {
          node: node,
        }
      }).then(res => {
        console.log(res.data)
        switch (node) {
          case 1:
            setNode1Status(res.data.result)
            break
          case 2:
            setNode2Status(res.data.result)
            break
          case 3:
            setNode3Status(res.data.result)
        }
      })
    }
  }, [])

  useEffect(() => {
    setMovies(null)
    axios.get('/api/movies', {
      params: {
        offset: offsetM,
        isolation: isolation
      }
    }).then(res => {
      setMovies(res.data)
    })
  }, [offsetM, isolation, node1status, node2status, node3status])

  return (
    <div className="p-5">
      <div className="alert alert-secondary fw-light" role="alert">
        *Current isolation level: {isolation} <br />
        *Node 1 Status: {node1status ? 'Online' : 'Offline'} <br />
        *Node 2 Status: {node2status ? 'Online' : 'Offline'} <br />
        *Node 3 Status: {node3status ? 'Online' : 'Offline'} <br />
      </div>
      <div>
        <div className="d-flex align-items-center">
          <p className="mb-0 me-3">Set isolation level:</p>
          <select 
            className="form-select w-25" 
            value={isolation} 
            onChange={e => setIsolation(e.target.value)}
          >
            <option value="READ UNCOMMITTED">READ UNCOMMITTED</option>
            <option value="READ COMMITTED">READ COMMITTED</option>
            <option value="REPEATABLE READ">REPEATABLE READ</option>
            <option value="SERIALIZABLE">SERIALIZABLE</option>
          </select>
        </div>
        <br />

        <button 
          className={`mb-2 btn ${node1status ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleNode(1)}
        >
          Toggle Node 1
        </button>
        <br />

        <button 
          className={`mb-2 btn ${node2status ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleNode(2)}
        >
          Toggle Node 2
        </button>
        <br />

        <button 
          className={`mb-2 btn ${node3status ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleNode(3)}
        >
          Toggle Node 3
        </button>
        <br />
      </div>

      <div className="d-flex justify-content-center">
        <div>
          <h4>Movies</h4>
          {!movies ? (
            <Loading />
          ) : (
            <>
            <Table movies={movies} isolation={isolation} />
            <button 
              className="btn btn-light border float-end"
              onClick={() => setOffsetM(offsetM + QUERY_LIMIT)}
            >
              Next {QUERY_LIMIT}
            </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
