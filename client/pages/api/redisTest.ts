


  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  import type { NextApiRequest, NextApiResponse } from 'next'
  import { Redis } from "@upstash/redis";

  type Data = {
      count: number
  }  

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {
    const redis = Redis.fromEnv();
    const count = await redis.incr("nextjsCounter");
    res.json({ count });
  }
  