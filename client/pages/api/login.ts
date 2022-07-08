


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from "@upstash/redis";
import axios from 'axios';
import { API_KEY } from '../../globals/riot_consts'

const redis = Redis.fromEnv();
type Data = {
    count: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // console.log("[teamData] method:", req.method);

    if (req.method == 'POST') {
        const data = req.body.data
        if (!data) {
            res.status(400).json({ error: 'No team data being sent' })
        } else {
            const id_tag = data.team_tag
            // console.log("New team TAG:", id_tag);

            const team_data = data
            // const response = await redis.hset('teams', { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
            const response = await redis.hset("TEAMS", { [id_tag]: team_data });
            // console.log(response);

            res.json({ response });
        }

    }
    if (req.method == 'PATCH') {
        const data = req.body.data
        if (!data) {
            res.status(400).json({ error: 'No team data being sent' })
        } else {
            const id_tag = data.team_tag
            // console.log("New team TAG:", id_tag);

            const team_data = data
            // const response = await redis.hset('teams', { [JSON.stringify(id_tag)]: JSON.stringify(team_data) });
            const response = await redis.hset("TEAMS", { [id_tag]: team_data });
            // console.log(response);

            res.json({ response });
        }
    }

    function getPlayerUUID(ign: string | string[]) {
        return axios.get(encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-name/" + ign + "?api_key=" + API_KEY))
            .then(response => {
                return response.data.puuid
            }).catch(err => err)
    }

    if (req.method == 'GET') {

        const ign: any = req.query.ign

        // console.log('team_tag param:', team_tag);
        let response = null;
        const PUUID = await getPlayerUUID(ign)

        const API_CALL = encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY)

        const userData = await axios.get(API_CALL)
            .then(response => response.data)
            .catch(err => err)

        res.status(200).json(userData)



    }



}
