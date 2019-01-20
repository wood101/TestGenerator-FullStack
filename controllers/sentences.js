const sentencesRouter = require('express').Router()
const Chapter = require('../models/chapter')
const Sentence = require('../models/sentence')
const morgan = require('morgan')

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
sentencesRouter.use(morgan(':method :url :json :status :response-time ms'))

sentencesRouter.get('/', async (request, response) => {
  const sentences = await Sentence
    .find({})
  response.json(sentences.map(Sentence.format))
})

sentencesRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    
    if (body.sentence === undefined || body.translation === undefined) {
      return response.status(400).json({ error: 'information missing' })
    }
    let spaces = body.emptySpaces

    if (body.emptySpaces === undefined) {
      spaces = 2
    }

    if (body.emptySpaces < 1) {
      return response.status(400).json({ error: 'empty spaces need to be bigger than 0' })
    }

    const chapter = await Chapter.findById(request.params.id)

    const sentence = new Sentence({
      sentence: body.sentence,
      emptySpaces: spaces,
      difficulty: body.difficulty
    })

    const newSentences = chapter.sentences
    newSentences.push(sentence)

    const newChapter = new Chapter({
      number: chapter.number,
      words: chapter.words,
      fillBlanks: chapter.fillBlanks,
      sentences: newSentences
    })

    const updatedData = await Chapter.findByIdAndUpdate(request.params.id, newChapter, { new: true })
    response.json(Chapter.format(updatedData))
    
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }  
})

sentencesRouter.delete('/:id', async (request, response) => {
  try {
    await Sentence.findByIdAndRemove(request.params.id)  
    response.status(204).end()
    
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = sentencesRouter
