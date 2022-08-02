


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
  console.log("[teamData] method:", req.method);
  if (req.method == 'GET') {
    const team_tag: any = req.query.team_tag
    // console.log('team_tag param:', team_tag);
    let response = null;

    if (await redis.hexists('TEAMS', team_tag)) {
      response = 'EXISTS'
    }



    // console.log(response);

    res.json({ response })

  }


  if (req.method == 'DELETE') {

    const team_tag: any = req.body.team_tag
    let response = null;

    if (team_tag != null) {
      response = await redis.hdel('TEAMS', team_tag)
    } else {
      res.status(400).json({ error: 'No team tag given' })

    }
    res.json({ response })

  }



}
