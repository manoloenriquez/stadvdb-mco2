// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import controller from '../../controllers/dbcontroller'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { offset }: any = req.query
  res.status(200).json(await controller.getDirectors(offset))
}
