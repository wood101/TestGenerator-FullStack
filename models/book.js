const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    id: String,
    title: String,
    author: String,
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }]
})

bookSchema.statics.format = function(book) {
    return {
        id: book._id,
        title: book.title,
        author: book.author,
        chapters: book.chapters
      }
  }

const Book = mongoose.model('Book', bookSchema);

module.exports = Book