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
  // const [ directors, setDirectors ] = useState<Array<Director>>(null)
  // const [ directors1, setDirectors1 ] = useState<Array<Director>>(null)
  // const [ offsetD, setOffsetD ] = useState<number>(0)
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

  const case3Trigger = (movie_id: number) => {
    axios.delete('/api/movies', {
      data: {
        id: movie_id,
        isolation: isolation
      }
    }).then(() => {
      console.log('fetching data')
      axios.get('/api/movies', {
        params: {
          offset: 0,
          isolation: isolation
        }
      }).then(res => {
        console.log('done fetching data')
        setMovies3(res.data)
      })
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
    setMovies1(null)
    setMovies2(null)
    setMovies3(null)
    setOffsetM(0)
    axios.get('/api/movies', {
      params: {
        offset: 0,
        isolation: isolation
      }
    }).then(res => {
      setMovies1(res.data)
      setMovies2(res.data)
      setMovies3(res.data)
    })
  }, [isolation, node1status, node2status, node3status])

  useEffect(() => {
    setMovies(null)
    setMovies4(null)
    axios.get('/api/movies', {
      params: {
        offset: offsetM,
        isolation: isolation
      }
    }).then(res => {
      setMovies(res.data)
      setMovies4(res.data)
    })
  }, [offsetM, isolation, node1status, node2status, node3status])

  // useEffect(() => {
  //   setDirectors(null)
  //   axios.get('/api/directors', {
  //     params: {
  //       offset: offsetD,
  //       isolation: isolation
  //     }
  //   }).then(res => {
  //     setDirectors(res.data)
  //   })
  // }, [offsetD, isolation, node1status, node2status, node3status])

  return (
    <div className="d-flex h-100">
      <div className="sidebar border me-4">
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

      <div className="content">
        <h3 className="mt-4">Concurrency Control and Consistency</h3>
        <h4 className="mt-4">Case 1</h4>
        <p>*All transactions are reading</p>
        <div className="d-flex gap-3">
          <div>
            <h4>Movies 1</h4>
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
            <h4>Movies 2</h4>
            {!movies4 ? (
              <Loading />
            ) : (
              <>
              <Table movies={movies4} isolation={isolation} />
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
          onClick={() => case3Trigger(movies3[0].movie_id)}
        >
          Trigger transaction
        </button>
        <div className="d-flex gap-3 mb-4">
          <div>
            <h4>Movies Table</h4>
            {!movies3 ? (
              <Loading />
            ) : (
              <Table movies={movies3} isolation={isolation} />
            )}
          </div>
        </div>
        <h3 className="mt-4">Global Failure Recovery</h3>
        
        <h4 className="mt-4">Case 1</h4>
        <p>*Transaction failure in writing to central node when attempting to replicate the transaction from Node 1 or Node 2</p>
        
        <h4 className="mt-4">Case 2</h4>
        <p>*Transaction failure in writing to Node 2 and Node 3 when attempting to replicate the transaction from central node</p>
        
        <h4 className="mt-4">Case 3</h4>
        <p>*The central node is unavailable during the transaction and then eventually comes back online.</p>
        <button 
          className="btn btn-secondary mb-3"
        >
          Trigger transaction
        </button>

        <h4 className="mt-4">Case 4</h4>
        <p>*Node 2 or Node 3 is unavailable during the transaction and then eventually comes back online.</p>
        <button 
          className="btn btn-secondary mb-3"
        >
          Trigger transaction
        </button>
      </div>
      

      <style jsx>{`
        .sidebar {
          width: 350px;
        }

        .content {
          overflow-x: scroll;
        }
      `}</style>
    </div>
    
  )
}
