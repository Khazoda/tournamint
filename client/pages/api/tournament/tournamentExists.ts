


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
  console.log("[tournamentExists] method:", req.method);

  if (req.method == 'GET') {
    const tournament_id: any = req.query.tournament_id
    // console.log('team_tag param:', team_tag);
    let response = null;

    if (await redis.hexists('TOURNAMENTS', tournament_id)) {
      response = 'EXISTS'
    }
    // console.log(response);

    res.json({ response })

  }
}
