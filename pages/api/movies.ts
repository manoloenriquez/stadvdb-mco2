// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import controller from '../../controllers/dbcontroller'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let isolation

  switch (req.method) {
    case 'GET':
      const { offset }: any = req.query
      isolation = req.query.isolation
      res.status(200).json(await controller.getMovies(offset, isolation))
      break
    case 'POST':
      break
    case 'UPDATE':
      break
    case 'DELETE':
      const { id }: any = req.body
      isolation = req.body.isolation
      await controller.deleteMovie(id, isolation)
      res.status(200).json({ message: `Deleted id ${id} from movies_dim`})
  }
}
