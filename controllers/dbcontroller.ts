/* eslint-disable import/no-anonymous-default-export */
import DBNode from '../models/node'
import type { Movie, Actor, Director, Role } from '../lib/types'

const nodeOne = new DBNode(
  'database-1.mysql.database.azure.com',
  'stdavdbadmin',
  'P^01UJaWG2##frd2862v'
)

const nodeTwo = new DBNode(
  'database-2.mysql.database.azure.com',
  'stdavdbadmin',
  'P^01UJaWG2##frd2862v'
)

const nodeThree = new DBNode(
  'database-3.mysql.database.azure.com',
  'stdavdbadmin',
  'P^01UJaWG2##frd2862v'
)

const connectNodes = async (): Promise<void> => {
  await nodeOne.connect()
  await nodeTwo.connect()
  await nodeThree.connect()
}

connectNodes()

export default {
  getMovies: async (offset: any, isolation?: string): Promise<Array<Movie>> => {
    let data = []
    let query = `SELECT * FROM movies_dim LIMIT ${offset}, 100`
    
    // await connectNodes()

    try {
      await nodeOne.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED')
      await nodeOne.query('START TRANSACTION')
      data = await nodeOne.query(query)
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
    }

    return data
  },
  insertMovie: async (data: Movie, isolation: string): Promise<void> => {
    let node: DBNode = data.movie_year < 1980 ? nodeTwo : nodeThree
    let query = `INSERT INTO (movie_name, movie_year_movie_ranking) movies_dim 
                  VALUES(${data.movie_name, data.movie_year, data.movie_ranking})
                `

    await connectNodes()

    await node.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
    await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

    await node.query('START TRANSACTION')
    await nodeOne.query('START TRANSACTION')

    try {
      await node.query(query)
      await nodeOne.query(query)

      await node.query('COMMIT')
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await node.query('ROLLBACK')
      await nodeOne.query('ROLLBACK')
    }
  },
  deleteMovie: async (id: string, isolation: string): Promise<void> => {
    let query = `DELETE FROM movies_dim WHERE movie_id = ${id}`

    await connectNodes()

    await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
    await nodeTwo.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
    await nodeThree.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

    await nodeOne.query('START TRANSACTION')
    await nodeTwo.query('START TRANSACTION')
    await nodeThree.query('START TRANSACTION')

    try {
      await nodeTwo.query(query)
      await nodeTwo.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await nodeTwo.query('ROLLBACK')
    }

    try {
      await nodeThree.query(query)
      await nodeThree.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await nodeThree.query('ROLLBACK')
    }

    try {
      await nodeOne.query(query)
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await nodeOne.query('ROLLBACK')
    }
  },
  updateMovie: async (data: Movie, isolation: string): Promise<void> => {
    let node: DBNode = data.movie_year < 1980 ? nodeTwo : nodeThree
    let query = `SET movie_name = ${data.movie_name}, movie_year = ${data.movie_year}, movie_ranking = ${data.movie_ranking}`

    await connectNodes()

    await node.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
    await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

    await node.query('START TRANSACTION')
    await nodeOne.query('START TRANSACTION')

    try {
      await node.query(query)
      await node.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await node.query('ROLLBACK')
    }

    try {
      await nodeOne.query(query)
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await nodeOne.query('ROLLBACK')
    }
  },
  getActors: async (offset: any, isolation?: string): Promise<Array<Actor>> => {
    let data = []
    let query = `SELECT * FROM actors_dim LIMIT ${offset}, 100`
    
    // await connectNodes()

    try {
      await nodeOne.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED')
      await nodeOne.query('START TRANSACTION')
      data = await nodeOne.query(query)
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
    }

    return data
  },
  getDirectors: async (offset: any, isolation?: string): Promise<Array<Director>> => {
    let data = []
    let query = `SELECT * FROM directors_dim LIMIT ${offset}, 100`
    
    // await connectNodes()

    try {
      await nodeOne.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED')
      await nodeOne.query('START TRANSACTION')
      data = await nodeOne.query(query)
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
    }

    return data
  },
  getRoles: async (offset: any, isolation?: string): Promise<Array<Director>> => {
    let data = []
    let query = `SELECT * FROM roles_fact LIMIT ${offset}, 100`
    
    // await connectNodes()

    try {
      await nodeOne.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED')
      await nodeOne.query('START TRANSACTION')
      data = await nodeOne.query(query)
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
    }

    return data
  }
}