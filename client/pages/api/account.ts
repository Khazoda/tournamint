


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();
type Data = {
  count: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // ******************
  // * CREATE ACCOUNT *
  // ******************
  if (req.method == 'POST') {
    const data = req.body.data
    if (!data) {
      res.status(400).json({ error: 'No account data being sent' })
    } else {
      const ign = data.ign
      // console.log("New team TAG:", id_tag);

      const account_data = data
      // const response = await redis.hset('teams', { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
      const response = await redis.hset("ACCOUNTS", { [ign]: account_data });
      // console.log(response);

      res.status(200).json({ response });
    }

  }
  // ******************
  // * UPDATE ACCOUNT *
  // ******************
  if (req.method == 'PATCH') {
    const data = req.body.data
    if (!data) {
      res.status(400).json({ error: 'No account data being sent' })
    } else {
      const ign = data.ign
      // console.log("New team TAG:", id_tag);

      const account_data = data
      // const response = await redis.hset('teams', { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
      const response = await redis.hset("ACCOUNTS", { [ign]: account_data });
      // console.log(response);

      res.status(200).json({ response });
    }
  }

  // *****************
  // ** GET ACCOUNT **
  // *****************
  if (req.method == 'GET') {
    const ign: any = req.query.ign
    let response = null;

    try {
      response = await redis.hget("ACCOUNTS", ign).then(data => {
        if (data == null) {
          res.status(200).json({ status: 'Account does not yet exist' })
        } else {
          res.status(200).json(data)
        }
      })
    } catch (error) {
      res.status(400).json({ error: error })
    }

  }
}
