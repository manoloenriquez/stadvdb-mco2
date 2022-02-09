// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from '../../lib/db'

export default async function handler(req, res) {
  try {
    await db.query('CREATE DATABASE nextjsconnected')
    res.status(200).json({ msg: 'Created Database nextjsconnected' })
  } catch (err) {
    await db.query('DROP DATABASE nextjsconnected')
    res.status(200).json({ msg: 'Dropped Database nextjsconnected' })
  }
}
