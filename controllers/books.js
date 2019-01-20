const booksRouter = require('express').Router()
const Book = require('../models/book')
const Chapter = require('../models/chapter')
const Word = require('../models/word')
const Sentence = require('../models/sentence')
const FillBlank = require('../models/fillBlank')
const morgan = require('morgan')

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
booksRouter.use(morgan(':method :url :json :status :response-time ms'))

booksRouter.get('/', async (request, response) => {
  const books = await Book
    .find({})
  response.json(books.map(Book.format))
})

booksRouter.get('/:id', async (request, response) => {
  const book = await Book.findById(request.params.id)
  response.json(book)
})

booksRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    if (body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }

    if (body.chapters < 1) {
      return response.status(400).json({ error: 'Book has to have more than 0 chapters' })
    }

    let chapters = []

    let chapter

    for(let i = 0; i < body.chapters; i++) {
      chapter = new Chapter({
        number: i + 1,
        words: [],
        sentences: [],
        fillBlanks: []
      })
      await chapter.save()
      chapters.push(chapter)
    }

    const book = new Book({
      title: body.title,
      author: body.author,
      chapters: chapters
    })

    const savedData = await book.save()

    response.json(Book.format(savedData))

  } catch (exception) {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
  }
})

booksRouter.delete('/:id', async (request, response) => {
  try {
    const book = await Book.findById(request.params.id)

    await book.chapters.map(chapter => {
      if(chapter.words !== undefined) chapter.words.map(word => Word.findByIdAndRemove(word.id))
      if(chapter.sentences !== undefined) chapter.sentences.map(sentence => Sentence.findByIdAndRemove(sentence.id))
      if(chapter.fillBlanks !== undefined) chapter.fillBlanks.map(fillBlank => FillBlank.findByIdAndRemove(fillBlank.id)) 
      Chapter.findByIdAndRemove(chapter.id)
    })
    await Book.findByIdAndRemove(request.params.id)   

    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = booksRouter
