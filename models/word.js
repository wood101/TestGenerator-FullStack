const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    id: String,
    translation: String,
    blankLength: Number,
    difficulty: String,
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }
})

wordSchema.statics.format = function(word) {
    return {
        id: word._id,
        translation: word.translation,
        blankLength: word.blankLength,
        difficulty: word.difficulty,
        chapter: word.chapter
      }
  }

const Word = mongoose.model('Word', wordSchema);

module.exports = Word