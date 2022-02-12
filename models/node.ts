import mysql, { Connection, MysqlError } from 'mysql'

export default class DBNode {
  host: string
  user: string
  password: string
  conn: Connection

  constructor(host: string, user: string, password: string) {
    this.host = host
    this.user = user
    this.password = password

    this.conn = mysql.createConnection({
      host: this.host,
      port: 3306,
      user: this.user,
      password: this.password,
      database: 'imdb'
    })
  }

  connect(): void {
    this.conn.connect(err => {
      if (err) {
        console.log(`Unable to connect to ${this.host}`)
        throw err
      }

      console.log(`Connected to ${this.host}`)
    })
  }

  close(): void {
    this.conn.end()
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