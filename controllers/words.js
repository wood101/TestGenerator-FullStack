const wordsRouter = require('express').Router()
const Chapter = require('../models/chapter')
const Word = require('../models/word')
const morgan = require('morgan')

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
wordsRouter.use(morgan(':method :url :json :status :response-time ms'))

wordsRouter.get('/', async (request, response) => {
  const words = await Word
    .find({})
  response.json(words.map(Word.format))
})

wordsRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    
    if (body.translation === undefined || body.blankLength === undefined) {
      return response.status(400).json({ error: 'information missing' })
    }

    const chapter = await Chapter.findById(request.params.id)

    const word = new Word({
      translation: body.translation,
      blankLength: body.blankLength,
      difficulty: body.difficulty
    })

    await word.save()

    let newWords = []

    if(chapter.words !== undefined) {
      newWords = chapter.words
    }
    
    newWords.push(word)

    const newChapter = new Chapter({
      number: chapter.number,
      sentences: chapter.sentences,
      fillBlanks: chapter.fillBlanks,
      words: newWords
    })

    const updatedData = await Chapter.findByIdAndUpdate(request.params.id, newChapter, { new: true })
    response.json(Chapter.format(updatedData))
    
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }  
})

wordsRouter.delete('/:id', async (request, response) => {
  try {
    await Word.findByIdAndRemove(request.params.id)  
    response.status(204).end()
    
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = wordsRouter
