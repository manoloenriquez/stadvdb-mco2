import DBNode from '../models/node'

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

nodeOne.connect()
nodeTwo.connect()
nodeThree.connect()

export default {
  getMovies: async () => {
    return await nodeOne.query('SELECT * FROM movies_dim LIMIT 100')
  }
}