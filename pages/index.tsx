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
  const [ c1movies, setC1Movies ] = useState<Array<Movie>>(null)
  const [ c1offsetM, setC1OffsetM ] = useState<number>(0)
  const [ c1actors, setC1Actors ] = useState<Array<Actor>>(null)
  const [ c1offsetA, setC1OffsetA ] = useState<number>(0)
  const [ c1directors, setC1Directors ] = useState<Array<Director>>(null)
  const [ c1offsetD, setC1OffsetD ] = useState<number>(0)
  const [ c1roles, setC1Roles ] = useState<Array<Role>>(null)
  const [ c1offsetR, setC1OffsetR ] = useState<number>(0)
  const [ c1isolation, setC1Isolation ] = useState<string>('uncommitted')

  const QUERY_LIMIT = 10

  useEffect(() => {
    axios.get('/api/movies', {
      params: {
        offset: c1offsetM,
        isolation: c1isolation
      }
    }).then(res => {
      setC1Movies(res.data)
    })
  }, [c1offsetM, c1isolation])

  useEffect(() => {
    axios.get('/api/actors', {
      params: {
        offset: c1offsetA,
        isolation: c1isolation
      }
    }).then(res => {
      setC1Actors(res.data)
    })
  }, [c1offsetA, c1isolation])

  useEffect(() => {
    axios.get('/api/directors', {
      params: {
        offset: c1offsetD,
        isolation: c1isolation
      }
    }).then(res => {
      setC1Directors(res.data)
    })
  }, [c1offsetD, c1isolation])

  useEffect(() => {
    axios.get('/api/roles', {
      params: {
        offset: c1offsetR,
        isolation: c1isolation
      }
    }).then(res => {
      setC1Roles(res.data)
    })
  }, [c1offsetR, c1isolation])

  return (
    <div className="p-5">
      {/* Case 1 */}
      <h2>Case 1</h2>
      <div className="alert alert-secondary" role="alert">
        All transactions are reading
      </div>
      <p>*Current isolation level: {c1isolation}</p>
      <div className="d-flex flex-wrap gap-3">
        <div>
          <h4>Movies</h4>
          {!c1movies ? (
            <Loading />
          ) : (
            <>
            <Table movies={c1movies} />
            <button 
              className="btn btn-light border float-end"
              onClick={() => setC1OffsetM(c1offsetM + QUERY_LIMIT)}
            >
              Next {QUERY_LIMIT}
            </button>
            </>
          )}
        </div>

        <div>
          <h4>Actors</h4>
          {!c1actors ? (
            <Loading />
          ) : (
            <>
            <Table actors={c1actors} />
            <button 
              className="btn btn-light border float-end"
              onClick={() => setC1OffsetA(c1offsetA + QUERY_LIMIT)}
            >
              Next {QUERY_LIMIT}
            </button>
            </>
          )}
        </div>

        <div>
          <h4>Directors</h4>
          {!c1directors ? (
            <Loading />
          ) : (
            <>
            <Table directors={c1directors} />
            <button 
              className="btn btn-light border float-end"
              onClick={() => setC1OffsetD(c1offsetD + QUERY_LIMIT)}
            >
              Next {QUERY_LIMIT}
            </button>
            </>
          )}
        </div>

        <div>
          <h4>Roles</h4>
          {!c1roles ? (
            <Loading />
          ) : (
            <>
            <Table roles={c1roles} />
            <button 
              className="btn btn-light border float-end"
              onClick={() => setC1OffsetR(c1offsetR + QUERY_LIMIT)}
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
