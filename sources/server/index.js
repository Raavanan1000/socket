import express from "express"
import crypto from "crypto"
import { EventEmitter } from "events"

const EVERY_FIVE_SECONDS = 5000

const generateRandomHexadecimal = () => crypto.randomBytes(10).toString("hex")

const generateEmail = () => `${generateRandomHexadecimal()}@${generateRandomHexadecimal()}.com`

const generateIdentifier = () => generateRandomHexadecimal()

const generateUsers = () => Array.from(Array(10)).map(() => ({
    email: generateEmail(),
    identifier: generateIdentifier()
}))

const usersEvent = new EventEmitter()

const server = express()

server.use(express.static("sources/client"))

server.get("/api/users", (request, response) => {
    response.setHeader("Content-Type", "text/event-stream")
    response.setHeader("Connection", "keep-alive")
    response.setHeader("Cache-Control", "no-cache")

    usersEvent.on("update", users => {
        response.write(`event: update\ndata: ${JSON.stringify(users)}\n\n`)
    })
})

server.listen(8000, "0.0.0.0", () => {
    console.log("Server listening")
})

setInterval(() => {
    usersEvent.emit("update", generateUsers())
}, EVERY_FIVE_SECONDS)