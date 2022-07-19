


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
    // * CREATE TOURNAMENT *
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
            const response = await redis.hset("TOURNEMENTS", { [ign]: account_data });
            // console.log(response);

            res.status(200).json({ response });
        }

    }
    // ******************
    // * UPDATE TOURNAMENT *
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
    // ** GET TOURNAMENT **
    // *****************
    if (req.method == 'GET') {
        const ign: any = req.query.ign
        // console.log('team_tag param:', team_tag);
        let response = null;

        try {
            response = await redis.hget("TOURNEMENTS", ign).then(data => {
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
