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

const QUERY_LIMIT = 10

export default {
  triggerNode: async (node): Promise<boolean> => {
    switch (parseInt(node)) {
      case 1:
        if (nodeOne.isOn) {
          await nodeOne.close()
          return false
        } else {
          await nodeOne.connect()
          return true
        }
      case 2:
        if (nodeTwo.isOn) {
          await nodeTwo.close()
          return false
        } else {
          await nodeTwo.connect()
          return true
        }
      case 3:
        if (nodeThree.isOn) {
          await nodeThree.close()
          return false
        } else {
          await nodeThree.connect()
          return true
        }
    }

    return false
  },
  getNodeStatus: (node): boolean => {
    switch (parseInt(node)) {
      case 1:
        return nodeOne.isOn
      case 2:
        return nodeTwo.isOn
      case 3:
        return nodeThree.isOn
    }
  },
  getMovies: async (offset: any, isolation?: string): Promise<Array<Movie>> => {
    if (!nodeOne.isOn && !nodeTwo.isOn && !nodeThree.isOn) return null

    let data = []
    
    if (nodeOne.isOn) {
      let query = `SELECT * FROM movies_dim LIMIT ${offset}, ${QUERY_LIMIT}`

      try {
        await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
        await nodeOne.query('START TRANSACTION')
        // await nodeOne.query('SELECT sleep(5)')
        data = await nodeOne.query(query)
        await nodeOne.query('COMMIT')
      } catch (err) {
        console.log(err.message)
      }
  
    } else if (nodeTwo.isOn && nodeThree.isOn) {
      let query = `SELECT * FROM movies_dim LIMIT ${offset / 2}, ${QUERY_LIMIT / 2}`

      try {
        await nodeTwo.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
        await nodeThree.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

        await nodeTwo.query('START TRANSACTION')
        await nodeThree.query('START TRANSACTION')

        data = [...await nodeTwo.query(query)]
        data = [...data, ...await nodeThree.query(query)]

        await nodeTwo.query('COMMIT')
        await nodeThree.query('COMMIT')
      } catch (err) {
        console.log(err.message)
      }
    }
    
    return data
  },
  // insertMovie: async (data: Movie, isolation: string): Promise<void> => {
  //   let node: DBNode = data.movie_year < 1980 ? nodeTwo : nodeThree
  //   let query = `
  //     INSERT INTO (movie_name, movie_year_movie_ranking) movies_dim 
  //     VALUES(${data.movie_name, data.movie_year, data.movie_ranking})
  //   `

  //   await node.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
  //   await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

  //   await node.query('START TRANSACTION')
  //   await nodeOne.query('START TRANSACTION')

  //   try {
  //     await node.query(query)
  //     await nodeOne.query(query)

  //     await node.query('COMMIT')
  //     await nodeOne.query('COMMIT')
  //   } catch (err) {
  //     console.log(err.message)
  //     await node.query('ROLLBACK')
  //     await nodeOne.query('ROLLBACK')
  //   }
  // },
  deleteMovie: async (id: string, isolation: string): Promise<Array<Movie>> => {
    let data = []

    let delRoles = `
      DELETE FROM roles_fact WHERE movie_id = ${id}
    `

    let delMovies = `
      DELETE FROM movies_dim WHERE movie_id = ${id}
    `

    let selectMovies = `
      SELECT * FROM movies_dim LIMIT ${QUERY_LIMIT}
    `

    let lock = `
      LOCK TABLE 
    `

    if (!nodeOne.isOn && (!nodeTwo.isOn || !nodeThree.isOn)) return
    console.log(`deleting ${id} with ${isolation}`)
    try {
      await nodeTwo.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
      await nodeTwo.query('START TRANSACTION')
      // await nodeTwo.query(query)
      await nodeTwo.query(delRoles)
      await nodeTwo.query(delMovies)
      await nodeTwo.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await nodeTwo.query('ROLLBACK')
    }

    try {
      await nodeThree.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
      await nodeThree.query('START TRANSACTION')
      // await nodeThree.query(query)
      await nodeThree.query(delRoles)
      await nodeThree.query(delMovies)
      await nodeThree.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await nodeThree.query('ROLLBACK')
    }

    try {
      await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
      await nodeOne.query('START TRANSACTION')
      // await nodeOne.query(query)
      await nodeOne.query(delRoles)
      await nodeOne.query(delMovies)
      data = [...data, ...await nodeOne.query(selectMovies)]
      await nodeOne.query('COMMIT')
    } catch (err) {
      console.log(err.message)
      await nodeOne.query('ROLLBACK')
    }

    return data
  },
  updateMovie: async (data: Movie, isolation: string): Promise<void> => {
    let node: DBNode = data.movie_year < 1980 ? nodeTwo : nodeThree
    let query = `SET movie_name = ${data.movie_name}, movie_year = ${data.movie_year}, movie_ranking = ${data.movie_ranking}`

    try {
      await node.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
      await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

      await node.query('START TRANSACTION')
      await nodeOne.query('START TRANSACTION')
    
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
  getDirectors: async (offset: any, isolation?: string): Promise<Array<Director>> => {
    if (!nodeOne.isOn && !nodeTwo.isOn && !nodeThree.isOn) return null

    let data = []
    
    if (nodeOne.isOn) {
      let query = `SELECT * FROM directors_dim LIMIT ${offset}, ${QUERY_LIMIT}`

      try {
        await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
        await nodeOne.query('START TRANSACTION')
        data = await nodeOne.query(query)
        await nodeOne.query('COMMIT')
      } catch (err) {
        console.log(err.message)
      }
  
    } else if (nodeTwo.isOn && nodeThree.isOn) {
      let query = `SELECT * FROM directors_dim LIMIT ${offset / 2}, ${QUERY_LIMIT / 2}`

      try {
        await nodeTwo.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
        await nodeThree.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

        await nodeTwo.query('START TRANSACTION')
        await nodeThree.query('START TRANSACTION')

        data = [...await nodeTwo.query(query)]
        data = [...data, ...await nodeThree.query(query)]

        await nodeTwo.query('COMMIT')
        await nodeThree.query('COMMIT')
      } catch (err) {
        console.log(err.message)
      }
    }
    
    return data
  }
}