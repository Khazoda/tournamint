


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { API_KEY } from '../../globals/riot_consts'

type Data = {
  name: string
}

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
  // console.log("/teamDisplayData API Call Fired")

  const ign = req.query.ign
  const PUUID = await getPlayerUUID(ign)
  const API_CALL = encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY)

  const userData = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

  res.status(200).json(userData)
}
