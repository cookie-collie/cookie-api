const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()

const corsOptions = {
    origin: process.env.ORIGIN_URL,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.send("Success!")
})

app.listen(process.env.PORT)

module.exports = app