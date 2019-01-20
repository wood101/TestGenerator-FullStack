const fillBlanksRouter = require('express').Router()
const Chapter = require('../models/chapter')
const FillBlank = require('../models/fillBlank')
const morgan = require('morgan')

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
fillBlanksRouter.use(morgan(':method :url :json :status :response-time ms'))

fillBlanksRouter.get('/', async (request, response) => {
  const fillBlanks = await FillBlank
    .find({})
  response.json(fillBlanks.map(FillBlank.format))
})

fillBlanksRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    
    if (body.sentence === undefined || body.blankLength === undefined || body.translation === undefined || body.difficulty === undefined) {
      return response.status(400).json({ error: 'information missing' })
    }

    const chapter = await Chapter.findById(request.params.id)

    const fillBlank = new FillBlank({
      sentence: body.sentence,
      blankLength: body.blankLength,
      translation: body.translation,
      difficulty: body.difficulty
    })

    const newFillBlanks = chapter.fillBlanks
    newFillBlanks.push(fillBlank)

    const newChapter = new Chapter({
      number: chapter.number,
      words: chapter.words,
      sentences: chapter.sentences,
      fillBlanks: newFillBlanks
    })

    const updatedData = await Chapter.findByIdAndUpdate(request.params.id, newChapter, { new: true })
    response.json(Chapter.format(updatedData))
    
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }  
})

fillBlanksRouter.delete('/:id', async (request, response) => {
  try {
    await FillBlank.findByIdAndRemove(request.params.id)  
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = fillBlanksRouter
