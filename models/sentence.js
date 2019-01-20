const mongoose = require('mongoose')

const sentenceSchema = new mongoose.Schema({
    id: String,
    sentence: String,
    emptySpaces: Number,
    difficulty: String,
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }
})

sentenceSchema.statics.format = function(sentence) {
    return {
        id: sentence._id,
        sentence: sentence.sentence,
        emptySpaces: sentence.emptySpaces,
        difficulty: sentence.difficulty,
        chapter: sentence.chapter
      }
  }

const Sentence = mongoose.model('Sentence', sentenceSchema);

module.exports = Sentence