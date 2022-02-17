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
  const [ c1movies1, setC1Movies1 ] = useState<Array<Movie>>(null)
  const [ c1movies2, setC1Movies2 ] = useState<Array<Movie>>(null)
  const [ c2movies1, setC2Movies1 ] = useState<Array<Movie>>(null)
  const [ c2movies2, setC2Movies2 ] = useState<Array<Movie>>(null)
  const [ c3movies1, setC3Movies1 ] = useState<Array<Movie>>(null)
  const [ c3movies2, setC3Movies2 ] = useState<Array<Movie>>(null)
  const [ isolation, setIsolation ] = useState<string>('READ UNCOMMITTED')

  const [ node1status, setNode1Status ] = useState<boolean>()
  const [ node2status, setNode2Status ] = useState<boolean>()
  const [ node3status, setNode3Status ] = useState<boolean>()

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
      setC2Movies1(res.data)
    })

    axios.get('/api/movies', {
      params: {
        isolation: isolation
      }
    }).then(res => {
      setC2Movies2(res.data)
    })
  }

  const case3Trigger2Movies = (movie1: number, movie1year: number, movie2: number, movie2year: number) => {
    axios.delete('/api/movies', {
      data: {
        id: movie1,
        year: movie1year,
        isolation: isolation
      }
    }).then(res => {
      setC3Movies1(res.data)
    })

    axios.delete('/api/movies', {
      data: {
        id: movie2,
        year: movie2year,
        isolation: isolation
      }
    }).then(res => {
      setC3Movies2(res.data)
    })
  }

  const case3TriggerDelUpdate = (id: number, year: number) => {
    axios.delete('/api/movies', {
      data: {
        id: id,
        year: year,
        isolation: isolation
      }
    }).then(res => {
      setC3Movies1(res.data)
    })

    axios.post('/api/movies', {
      isolation: isolation
    }).then(res => {
      console.log(res.data)
      setC3Movies2(res.data)
    })
  }

  useEffect(() => {
    for (let node = 1; node <= 3; node++) {
      // axios.get('/api/nodes', {
      //   params: {
      //     node: node,
      //   }
      // }).then(res => {
      //   console.log(res.data)
      //   switch (node) {
      //     case 1:
      //       setNode1Status(res.data.result)
      //       break
      //     case 2:
      //       setNode2Status(res.data.result)
      //       break
      //     case 3:
      //       setNode3Status(res.data.result)
      //   }
      // })
      toggleNode(node)
    }
  }, [])

  useEffect(() => {
    setC1Movies1(null)
    setC1Movies2(null)
    setC2Movies1(null)
    setC2Movies2(null)
    setC3Movies1(null)
    setC3Movies2(null)

    axios.get('/api/movies', {
      params: {
        isolation: isolation
      }
    }).then(res => {
      setC1Movies1(res.data)
      setC2Movies1(res.data)
      setC3Movies1(res.data)
    })

    axios.get('/api/movies', {
      params: {
        isolation: isolation,
        node: true
      }
    }).then(res => {
      setC1Movies2(res.data)
      setC2Movies2(res.data)
      setC3Movies2(res.data)
    })
  }, [isolation, node1status, node2status, node3status])

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
            {!c1movies1 ? (
              <Loading />
            ) : (
              <Table movies={c1movies1} />
            )}
          </div>

          <div>
            <h4>Movies 2</h4>
            {!c1movies2 ? (
              <Loading />
            ) : (
              <Table movies={c1movies2} />
            )}
          </div>
        </div>

        <h4 className="mt-4">Case 2</h4>
        <p>*Table 1 is writing, Table 2 is reading</p>
        <button 
          className="btn btn-secondary mb-3"
          onClick={() => case2Trigger(c2movies1[0].movie_id)}
        >
          Delete first row
        </button>
        <div className="d-flex gap-3">
          <div>
            <h4>Movies Table 1</h4>
            {!c2movies1 ? (
              <Loading />
            ) : (
              <Table movies={c2movies1} />
            )}
          </div>

          <div>
            <h4>Movies Table 2</h4>
            {!c2movies2 ? (
              <Loading />
            ) : (
              <Table movies={c2movies2} />
            )}
          </div>
        </div>

        <h4 className="mt-4">Case 3</h4>
        <p>*Both transactions are writing</p>
        <button 
          className="btn btn-secondary mb-3"
          onClick={() => case3Trigger2Movies(
            c3movies1[0].movie_id, 
            c3movies1[0].movie_year, 
            c3movies1[1].movie_id,
            c3movies1[1].movie_year
          )}
        >
          Delete first 2 rows
        </button> <br />
        <button 
          className="btn btn-secondary mb-3"
          onClick={() => case3TriggerDelUpdate(c3movies1[1].movie_id, c3movies1[1].movie_year)}
        >
          Delete second row and Insert new movie
        </button>
        <div className="d-flex gap-3 mb-4">
          <div>
            <h4>Movies Table 1</h4>
            {!c3movies1 ? (
              <Loading />
            ) : (
              <Table movies={c3movies1} />
            )}
          </div>
          <div>
            <h4>Movies Table 2</h4>
            {!c3movies2 ? (
              <Loading />
            ) : (
              <Table movies={c3movies2} />
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

        {/* <div className="d-flex gap-3">
          <div>
            <h4>Central Node</h4>
            {!movies ? (
              <Loading />
            ) : (
              <Table movies={movies} isolation={isolation} />
            )}
          </div>
        </div> */}

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
