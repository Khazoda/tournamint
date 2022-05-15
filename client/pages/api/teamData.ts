


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
  console.log("method:", req.method);

  if (req.method == 'POST') {
    const data = req.body.data
    if (!data) {
      res.status(400).json({ error: 'No team data being sent' })
    } else {
      const id_tag = data.team_tag
      console.log(id_tag);

      const team_data = data
      // const response = await redis.hset('teams', { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
      const response = await redis.hset("TEAMS", { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
      console.log(response);

      res.json({ response });
    }

  }

  if (req.method == 'GET') {
    const team_tag: any = req.query.team_tag
    console.log('params:', team_tag);


    const response = await redis.hget("TEAMS", team_tag)

    console.log(response);

    res.json({ response })

  }



}
