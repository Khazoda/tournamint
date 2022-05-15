


  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}
const API_KEY = 'RGAPI-a65ff374-7f9b-4aed-9b7a-fadf87277db8'

function getPlayerUUID(ign: string | string[]) {
  return axios.get(encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-name/" + ign + "?api_key=" + API_KEY))
    .then(response => {
      return response.data.puuid
    }).catch(err => err)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log("/userData API Call Fired")

  const ign = req.query.ign
  const PUUID = await getPlayerUUID(ign)
  const API_CALL = encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY)

  const userData = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

  res.status(200).json(userData)
}
