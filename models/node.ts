import mysql, { Pool, PoolConnection, MysqlError } from 'mysql'

export default class DBNode {
  host: string
  user: string
  password: string
  pool: Pool
  conn: PoolConnection
  isOn: boolean
  recovery: Array<string>

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
    this.recovery = []
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(async (err, conn) => {
        if (err) {
          reject(err)
        }
  
        console.log(`Connected to ${this.host}`)
        this.isOn = true
        this.conn = conn

        console.log('recovering node...')
        console.log(this.recovery)
        while (this.recovery.length > 0) {
          let q = this.recovery.shift()
          console.log(q)
          await this.query(q)
        }
        await this.query('COMMIT')
        console.log('node recovered')
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
      this.recovery.push(q)
      console.log(this.recovery)
      if (!this.isOn || this.conn.state === 'disconnected') reject('Node not connected')
      this.conn.query(q, (err: MysqlError, result) => {
        if (err) reject(err)
        this.recovery.pop()
        resolve(result)
      })
    })
  }
}