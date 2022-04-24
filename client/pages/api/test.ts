

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}
const API_KEY = 'RGAPI-a65ff374-7f9b-4aed-9b7a-fadf87277db8'

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
