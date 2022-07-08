

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { API_KEY } from '../../globals/riot_consts'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const API_CALL = encodeURI("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Xpeke?api_key=" + API_KEY)
  const champion_rotation = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

  res.status(200).json(champion_rotation)
}
