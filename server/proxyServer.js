var express = require('express')
var cors = require('cors')
const axios = require('axios')
const { request, response } = require('express')

var app = express()
app.use(cors())

const API_KEY = 'RGAPI-0d7ee564-2f07-4d70-ac9a-617d9c9034f4'

function getPlayerUUID(userName) {
    return axios.get("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-name/" + userName + "?api_key=" + API_KEY)
        .then(response => {
            return response.data.puuid
        }).catch(err => err)
}
app.get('/testAPICall', async (req, res) => {
    const API_CALL = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/June loves kegs?api_key=" + API_KEY
    const champion_rotation = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)

    res.json(champion_rotation)

})
app.get('/userData', async (req, res) => {
    const userName = req.query.username
    const PUUID = await getPlayerUUID(userName)
    const API_CALL = "https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY

    const userData = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)

    res.json(userData)
})
app.listen(4000, function () {
    console.log("Server started on port 4000");
})

