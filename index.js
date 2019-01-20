const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const booksRouter = require('./controllers/books')
const chaptersRouter = require('./controllers/chapters')
const wordsRouter = require('./controllers/words')
const sentencesRouter = require('./controllers/sentences')
const fillBlanksRouter = require('./controllers/fillBlanks')

const config = require('./utils/config')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use('/api/books', booksRouter)
app.use('/api/chapters', chaptersRouter)
app.use('/api/words', wordsRouter)
app.use('/api/sentences', sentencesRouter)
app.use('/api/fillBlanks', fillBlanksRouter)

mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
