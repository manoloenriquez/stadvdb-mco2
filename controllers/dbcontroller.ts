/* eslint-disable import/no-anonymous-default-export */
import DBNode from '../models/node'
import type { Movie } from '../lib/types'

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

async function getCentralNode(isolation: string) {
  if (!nodeOne.isOn) return []

  let data = []
  let query = `SELECT * FROM movies_dim ORDER BY movie_id DESC LIMIT ${QUERY_LIMIT}`

  try {
    await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
    await nodeOne.query('START TRANSACTION')
    data = await nodeOne.query(query)
    await nodeOne.query('COMMIT')
  } catch (err) {
    console.log(err.message)
  }

  return data
}

async function getFromNodes(isolation: string) {
  if (!nodeTwo.isOn || !nodeThree.isOn) return []

  let data = []
  let query = `SELECT * FROM movies_dim ORDER BY movie_id DESC LIMIT ${QUERY_LIMIT}`

  try {
    await nodeTwo.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
    await nodeThree.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

    await nodeTwo.query('START TRANSACTION')
    await nodeThree.query('START TRANSACTION')

    data = [...await nodeTwo.query(query), ...await nodeThree.query(query)]
    data.sort((x, y) => y.movie_id - x.movie_id)

    await nodeTwo.query('COMMIT')
    await nodeThree.query('COMMIT')
  } catch (err) {
    console.log(err.message)
  }

  return data.slice(0, 10)
}

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
  getMovies: async (isolation: string, node?: any): Promise<Array<Movie>> => {
    if (!nodeOne.isOn && !nodeTwo.isOn && !nodeThree.isOn) return []

    let data = node === undefined ? await getCentralNode(isolation) : await getFromNodes(isolation)

    return data
  },
  deleteMovie: async (id: number, year: number, isolation: string): Promise<Array<Movie>> => {
    let data = []

    let delRoles = `
      DELETE FROM roles_fact WHERE movie_id = ${id}
    `

    let delMovies = `
      DELETE FROM movies_dim WHERE movie_id = ${id}
    `

    let selectMovies = `
      SELECT * FROM movies_dim ORDER BY movie_id DESC LIMIT ${QUERY_LIMIT}
    `

    console.log(`deleting ${id} with ${isolation}`)
    
    if (year < 1980) { // Delete from central node and node 2
      try {
        await nodeTwo.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
        await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
  
        await nodeTwo.query('START TRANSACTION')
        await nodeOne.query('START TRANSACTION')
  
        console.log('starting delete transaction on node 1 and node 2')
  
        await nodeTwo.query(delRoles)
        await nodeTwo.query(delMovies)
  
        await nodeOne.query(delRoles)
        await nodeOne.query(delMovies)
  
        data = nodeOne.isOn ? await nodeOne.query(selectMovies) : await nodeTwo.query(selectMovies)
  
        console.log('committing delete transaction on node 1 and node 2')
  
        await nodeTwo.query('COMMIT')
        await nodeOne.query('COMMIT')
  
        console.log('committed delete transaction on node 1 and node 2')
      } catch (err) {
        console.log(err.message)
        console.log('rolled back delete transaction on node 1 and node 2')
        await nodeTwo.query('ROLLBACK')
        await nodeOne.query('ROLLBACK')
      } finally {
        return data
      }
    } else { // Delete from central node and node 3
      try {
        await nodeThree.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
        await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
  
        await nodeThree.query('START TRANSACTION')
        await nodeOne.query('START TRANSACTION')
  
        console.log('starting delete transaction on node 1 and node 3')
  
        await nodeThree.query(delRoles)
        await nodeThree.query(delMovies)
  
        await nodeOne.query(delRoles)
        await nodeOne.query(delMovies)
  
        data = nodeOne.isOn ? await nodeOne.query(selectMovies) : await nodeThree.query(selectMovies)
  
        console.log('committing delete transaction on node 1 and node 3')
  
        await nodeThree.query('COMMIT')
        await nodeOne.query('COMMIT')
  
        console.log('committed delete transaction on node 1 and node 3')
      } catch (err) {
        console.log(err.message)
        console.log('rolled back delete transaction on node 1 and node 3')
        await nodeThree.query('ROLLBACK')
        await nodeOne.query('ROLLBACK')
      } finally {
        return data
      }
    }
  },
  insertMovie: async (isolation: string): Promise<Array<Movie>> => {
    let newMovie: Movie = {
      movie_name: 'New movie testing',
      movie_year: 2022,
      movie_ranking: 5
    }

    let selMaxId = `
      SELECT MAX(movie_id) as max_id FROM movies_dim
    `

    let selMovies = `
      SELECT * from movies_dim ORDER BY movie_id DESC LIMIT ${QUERY_LIMIT}
    `

    let node = newMovie.movie_year < 1980 ? nodeTwo : nodeThree

    let data = []

    // Execute queries
    try {
      await nodeOne.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)
      await node.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation}`)

      await nodeOne.query('START TRANSACTION')
      await node.query('START TRANSACTION')

      console.log('insert transaction started')

      // Get max id
      let data = await nodeOne.query(selMaxId)
      let max_id = data[0].max_id
      
      newMovie.movie_id = max_id + 1

      let insertMovie = `
        INSERT INTO movies_dim (movie_id, movie_name, movie_year, movie_ranking)
        VALUES ('${newMovie.movie_id}', '${newMovie.movie_name}', '${newMovie.movie_year}', '${newMovie.movie_ranking}')
      `

      await nodeOne.query(insertMovie)
      await node.query(insertMovie)

      data = await nodeOne.query(selMovies)
      console.log('committing insert transaction')

      await nodeOne.query('COMMIT')
      await node.query('COMMIT')

      console.log('committed insert transaction')
    } catch (err) {
      console.log(err.message)
      console.log('rolling back insert transactions')
      await nodeOne.query('ROLLBACK')
      await node.query('ROLLBACK')
    } finally {
      return data
    }
  }
}