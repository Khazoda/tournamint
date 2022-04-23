const app = require('express')();
const { v4 } = require('uuid');
const axios = require('axios')
var cors = require('cors')

app.use(cors())

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

const API_KEY = 'RGAPI-a65ff374-7f9b-4aed-9b7a-fadf87277db8'

function getPlayerUUID(ign) {
  return axios.get(encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-name/" + ign + "?api_key=" + API_KEY))
    .then(response => {
      return response.data.puuid
    }).catch(err => err)
}
function getPlayerID(ign) {
  return axios.get(encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-name/" + ign + "?api_key=" + API_KEY))
    .then(response => {
      return response.data.id
    }).catch(err => err)
}
app.get('/api/testAPICall', async (req, res) => {
  const API_CALL = encodeURI("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Xpeke?api_key=" + API_KEY)
  const champion_rotation = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

  res.json(champion_rotation)

})
app.get('/api/userData', async (req, res) => {
  console.log("/userData API Call Fired")

  const ign = req.query.ign
  const PUUID = await getPlayerUUID(ign)
  const API_CALL = encodeURI("https://euw1.api.riotgames.com/" + "lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY)

  const userData = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

  res.json(userData)
})
app.get('/api/userRanking', async (req, res) => {
  console.log("/api/userRanking API Call Fired")

  const ign = req.query.ign
  const ID = await getPlayerID(ign)
  const API_CALL = encodeURI("https://euw1.api.riotgames.com/" + "lol/league/v4/entries/by-summoner/" + ID + "?api_key=" + API_KEY)

  const userData = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

  res.json(userData)
})

// Root Dummy Query
app.get("/", (req, res) => {
  res.send("Express is running");
});

module.exports = app;