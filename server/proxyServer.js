var express = require('express')
var cors = require('cors')
const axios = require('axios')
const { request, response } = require('express')

var app = express()
app.use(cors())

const API_KEY = 'RGAPI-b8f186d2-67d4-48ee-8096-be4cac553b13'

function getPlayerUUID(userName) {
    return axios.get("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-name/" + userName + "?api_key=" + API_KEY)
        .then(response => {
            console.log(response.data);
            return response.data.puuid
        }).catch(err => err)
}

app.get('/past5Games', async (req, res) => {
    const userName = "June loves kegs"
    const PUUID = await getPlayerUUID(userName)

    const API_CALL = "https://europe.api.riotgames.com/" + "lol/match/v5/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY
    const gameIDs = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)

    console.log(gameIDs);
    var matchDataArray = [];
    for (var i = 0; i < gameIDs.length - 15; i++) {
        const matchData = await axios.get("https://europe.api.riotgames.com/" + "lol/match/v5/matches" + "?api_key=" + API_KEY)
            .then(response => response.data)
            .catch(err => err)

        matchDataArray.push(matchData)
    }

    res.json(matchDataArray)
})
app.listen(4000, function () {
    console.log("Server started on port 4000");
})

