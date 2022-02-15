import mysql, { Connection, MysqlError } from 'mysql'

export default class DBNode {
  host: string
  user: string
  password: string
  conn: Connection
  isOn: boolean

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

    this.isOn = false
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.connect(err => {
        if (err) {
          reject(err)
        }
  
        console.log(`Connected to ${this.host}`)
        this.isOn = true
        resolve()
      })
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.end(err => {
        if (err) reject(err)
        resolve()
      })
    })
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