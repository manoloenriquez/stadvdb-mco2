import mysql from 'mysql'
import util from 'util'

const conn = mysql.createConnection({
  host: process.env.NEXT_PUBLIC_HOST || '127.0.0.1',
  port: process.env.NEXT_PUBLIC_PORT || 3306,
  user: process.env.NEXT_PUBLIC_USERNAME || 'root',
  password: process.env.NEXT_PUBLIC_PASSWORD || '',
})

conn.connect(err => {
  if (err) throw err

  console.log('Connected to MySQL server.')
})

export default {
  query: util.promisify(conn.query).bind(conn)
}