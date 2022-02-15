import mysql, { Pool, PoolConnection, MysqlError } from 'mysql'

export default class DBNode {
  host: string
  user: string
  password: string
  pool: Pool
  conn: PoolConnection
  isOn: boolean

  constructor(host: string, user: string, password: string) {
    this.host = host
    this.user = user
    this.password = password

    this.pool = mysql.createPool({
      host: this.host,
      port: 3306,
      user: this.user,
      password: this.password,
      database: 'imdb'
    })

    this.isOn = false
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          reject(err)
        }
  
        console.log(`Connected to ${this.host}`)
        this.isOn = true
        this.conn = conn
        resolve()
      })
    })
  }

  async close(): Promise<void> {
    this.isOn = false
    this.conn.release()
  }

  async query(q: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(q, (err: MysqlError, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}