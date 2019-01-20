const chaptersRouter = require('express').Router()
const Chapter = require('../models/chapter')
const Word = require('../models/word')
const Sentence = require('../models/sentence')
const FillBlank = require('../models/fillBlank')
const morgan = require('morgan')

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
chaptersRouter.use(morgan(':method :url :json :status :response-time ms'))

chaptersRouter.get('/', async (request, response) => {
  const chapters = await Chapter
    .find({})
    .populate('words')
    .populate('sentences')
    .populate('fillBlanks')
  response.json(chapters.map(Chapter.format))
})

chaptersRouter.delete('/:id', async (request, response) => {
  try {
    const chapter = await Chapter.findById(request.params.id)

    await Chapter.findByIdAndRemove(request.params.id)
    await chapter.words.map(word => Word.findByIdAndRemove(word.id))
    await chapter.sentences.map(sentence => Sentence.findByIdAndRemove(sentence.id))
    await chapter.fillBlanks.map(fillBlank => FillBlank.findByIdAndRemove(fillBlank.id))        
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = chaptersRouter
