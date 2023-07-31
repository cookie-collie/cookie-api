const google = require("googleapis")
require("dotenv").config()

const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
const SHEET_ID = process.env.SHEET_ID

// const b64_PRIVATE_KEY = Buffer.from(PRIVATE_KEY_RAW).toString("base64")
// const PRIVATE_KEY = `
// -----BEGIN PRIVATE KEY-----
// ${b64_PRIVATE_KEY}
// -----END PRIVATE KEY-----
// `

const client = new google.Auth.JWT(CLIENT_EMAIL, null, PRIVATE_KEY, ["https://www.googleapis.com/auth/spreadsheets"])

const sheet = google.google.sheets({version: "v4", auth: client})

module.exports = sheet