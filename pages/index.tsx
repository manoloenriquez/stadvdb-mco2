import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Movie, Director } from '../lib/types'
import Table from '../components/Table'

const Loading = () => (
  <div className="p-5">
    <h3>Loading...</h3>
  </div>
)

export default function Home() {
  const [ movies, setMovies ] = useState<Array<Movie>>(null)
  const [ movies1, setMovies1 ] = useState<Array<Movie>>(null)
  const [ movies2, setMovies2 ] = useState<Array<Movie>>(null)
  const [ movies3, setMovies3 ] = useState<Array<Movie>>(null)
  const [ movies4, setMovies4 ] = useState<Array<Movie>>(null)
  const [ offsetM, setOffsetM ] = useState<number>(0)
  const [ directors, setDirectors ] = useState<Array<Director>>(null)
  const [ offsetD, setOffsetD ] = useState<number>(0)
  const [ isolation, setIsolation ] = useState<string>('READ UNCOMMITTED')

  const [ node1status, setNode1Status ] = useState<boolean>()
  const [ node2status, setNode2Status ] = useState<boolean>()
  const [ node3status, setNode3Status ] = useState<boolean>()

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

  const case2Trigger = (id: number) => {
    axios.delete('/api/movies', {
      data: {
        id: id,
        isolation: isolation
      }
    }).then(res => {
      setMovies1(res.data)
    })

    axios.get('/api/movies', {
      params: {
        offset: 0,
        isolation: isolation
      }
    }).then(res => {
      setMovies2(res.data)
    })
  }

  const case3Trigger = (id: number) => {

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
    axios.get('/api/movies', {
      params: {
        offset: 0,
        isolation: isolation
      }
    }).then(res => {
      setMovies1(res.data)
      setMovies2(res.data)
      setMovies3(res.data)
      setMovies4(res.data)
    })
  }, [isolation, node1status, node2status, node3status])

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

  useEffect(() => {
    setDirectors(null)
    axios.get('/api/directors', {
      params: {
        offset: offsetD,
        isolation: isolation
      }
    }).then(res => {
      setDirectors(res.data)
    })
  }, [offsetD, isolation, node1status, node2status, node3status])

  return (
    <div className="d-flex gap-5">
      <div className="border">
        <div className="position-sticky top-0 p-3">
          <div className="alert alert-secondary fw-light" role="alert">
            *Current isolation level: {isolation} <br />
            *Node 1 Status: {node1status ? 'Online' : 'Offline'} <br />
            *Node 2 Status: {node2status ? 'Online' : 'Offline'} <br />
            *Node 3 Status: {node3status ? 'Online' : 'Offline'} <br />
          </div>
          <div className="p-4">
            <div className="d-flex align-items-center">
              <p className="mb-0 me-3">Isolation level:</p>
              <select 
                className="form-select" 
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
        </div>
      </div>

      <div>
        <h4 className="mt-4">Case 1</h4>
        <p>*All transactions are reading</p>
        <div className="d-flex gap-3">
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

          <div>
            <h4>Directors</h4>
            {!directors ? (
              <Loading />
            ) : (
              <>
              <Table directors={directors} isolation={isolation} />
              <button 
                className="btn btn-light border float-end"
                onClick={() => setOffsetD(offsetD + QUERY_LIMIT)}
              >
                Next {QUERY_LIMIT}
              </button>
              </>
            )}
          </div>
        </div>

        <h4 className="mt-4">Case 2</h4>
        <p>*Table 1 is writing, Table 2 is reading</p>
        <button 
          className="btn btn-secondary mb-3"
          onClick={() => case2Trigger(movies1[0].movie_id)}
        >
          Delete first row
        </button>
        <div className="d-flex gap-3">
          <div>
            <h4>Movies Table 1</h4>
            {!movies1 ? (
              <Loading />
            ) : (
              <Table movies={movies1} isolation={isolation} />
            )}
          </div>

          <div>
            <h4>Movies Table 2</h4>
            {!movies2 ? (
              <Loading />
            ) : (
              <Table movies={movies2} isolation={isolation} />
            )}
          </div>
        </div>

        <h4 className="mt-4">Case 3</h4>
        <p>*Both transactions are writing</p>
        <button 
          className="btn btn-secondary mb-3"
          onClick={() => case2Trigger(movies1[0].movie_id)}
        >
          Trigger transaction
        </button>
        <div className="d-flex gap-3 mb-4">
          <div>
            <h4>Movies Table 1</h4>
            {!movies1 ? (
              <Loading />
            ) : (
              <Table movies={movies3} isolation={isolation} />
            )}
          </div>

          <div>
            <h4>Movies Table 2</h4>
            {!movies2 ? (
              <Loading />
            ) : (
              <Table movies={movies4} isolation={isolation} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
