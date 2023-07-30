const express = require("express")
const app = express()
const cors = require("cors")
const sheet = require("./googleSheetLogic")
const { default: axios } = require("axios")
require("dotenv").config()

const corsOptions = {
    origin: process.env.ORIGIN_URL,
    credentials: true,
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.send("Success!")
})

app.post("/test-send", (req, res) => {
    console.log(req.body["comm-type"])
    res.status(200).json({ message: "OK" })
})

app.post("/api/request", async (req, res) => {
    const { form, CAPTCHAToken } = req.body

    try {
        const _CAPTCHARes = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PRIVATE_KEY}&response=${CAPTCHAToken}`
        )

        if (_CAPTCHARes.data.success) {
            try {
                const _extractedValues = Object.values(form)
                const _timestamp = new Date()
                _extractedValues.unshift(_timestamp.toUTCString())

                await sheet.spreadsheets.values.append({
                    spreadsheetId: process.env.SHEET_ID,
                    range: "comm-requests!A3:J",
                    insertDataOption: "INSERT_ROWS",
                    valueInputOption: "RAW",
                    requestBody: {
                        values: [_extractedValues],
                    },
                })

                res.status(200).json({
                    message: "Form added successfully",
                    formValue: form,
                })
            } catch (e) {
                res.status(400).json({
                    message: "Possible errors at Google Sheet API",
                    error: e
                })
            }
        } else {
            res.status(400).json({ message: "Might be a robot", error: e })
        }
    } catch (e) {
        res.status(500).json({ error: e, message: e.message })
    }
})

app.listen(process.env.PORT)

module.exports = app
