


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
            res.status(400).json({ error: 'No tournament data being sent' })
        } else {
            const tournament_id = data.tournament_id
            console.log("New tournament ID:", tournament_id);

            const tournament_data = data
            console.log("New tournament data:", tournament_data);

            // const response = await redis.hset('teams', { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
            const response = await redis.hset("TOURNAMENTS", { [tournament_id]: tournament_data });
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
            res.status(400).json({ error: 'No tournament data being sent' })
        } else {
            const tournament_id = data.tournament_id
            // console.log("New team TAG:", id_tag);

            const tournament_data = data
            // const response = await redis.hset('teams', { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
            const response = await redis.hset("TOURNAMENTS", { [tournament_id]: tournament_data });
            // console.log(response);

            res.status(200).json({ response });
        }
    }

    // *****************
    // ** GET TOURNAMENT **
    // *****************
    if (req.method == 'GET') {
        const tournament_id: any = req.query.tournament_id
        // console.log('team_tag param:', team_tag);
        let response = null;
        console.log(req.query);

        try {
            if (tournament_id == '') {
                response = await redis.hgetall("TOURNAMENTS").then(data => {
                    if (data == null) {
                        res.status(400).json({ status: 'Error retrieving tournaments' })
                    } else {
                        res.status(200).json(data)
                    }
                })
            } else {
                response = await redis.hget("TOURNAMENTS", tournament_id).then(data => {
                    if (data == null) {
                        res.status(400).json({ status: 'Tournament does not exist', tournament_id: tournament_id })
                    } else {
                        res.status(200).json(data)
                    }
                })
            }
        } catch (error) {
            res.status(400).json({ error: error })
        }

    }
}
