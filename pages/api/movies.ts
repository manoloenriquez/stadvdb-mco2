// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import controller from '../../controllers/dbcontroller'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let isolation

  switch (req.method) {
    case 'GET':
      isolation = req.query.isolation
      const { node } = req.query
      res.status(200).json(await controller.getMovies(isolation, node))
      break
    case 'POST':
      isolation = req.body.isolation
      res.status(200).json(await controller.insertMovie(isolation))
      break
    case 'UPDATE':
      break
    case 'DELETE':
      const { id, year }: any = req.body
      isolation = req.body.isolation
      res.status(200).json(await controller.deleteMovie(id, year, isolation))
  }
}
