// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import controller from '../../controllers/dbcontroller'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  
  switch (req.method) {
    case 'GET':
      res.status(200).json({ result: controller.getNodeStatus(req.query.node) })
      break
    case 'POST':
      res.status(200).json({ result: await controller.triggerNode(req.body.node) })
  }
}
