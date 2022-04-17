var express = require('express')
var cors = require('cors')
const axios = require('axios')
const { request, response } = require('express')

var app = express()
app.use(cors())

const API_KEY = 'RGAPI-a65ff374-7f9b-4aed-9b7a-fadf87277db8'

function getPlayerUUID(ign) {
    return axios.get("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-name/" + ign + "?api_key=" + API_KEY)
        .then(response => {
            return response.data.puuid
        }).catch(err => err)
}
app.get('/testAPICall', async (req, res) => {
    const API_CALL = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Xpeke?api_key=" + API_KEY
    const champion_rotation = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)

    res.json(champion_rotation)

})
app.get('/userData', async (req, res) => {
    const ign = req.query.ign
    const PUUID = await getPlayerUUID(ign)
    const API_CALL = "https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY

    const userData = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)

    res.json(userData)
    console.log(userData);
})
app.listen(4000, function () {
    console.log("Server started on port 4000");
})

