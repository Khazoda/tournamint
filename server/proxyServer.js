var express = require('express')
var cors = require('cors')
const axios = require('axios')

var app = express()
app.use(cors())

const API_KEY = 'RGAPI-59b233aa-d845-47ae-833c-f50ed3d2433c'

app.listen(4000, function () {
    console.log("Server started on port 4000");
})

