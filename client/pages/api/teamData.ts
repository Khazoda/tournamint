


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
  console.log(req.body.data);

  const data = req.body.data
  if (!data) {
    res.status(400).json({ error: 'No team data being sent' })
  } else {
    const id_tag = data.team_tag
    const team_data = data
    const response = await redis.hset('teams', { [id_tag]: JSON.stringify(team_data) });
    res.json({ response });
  }


}
