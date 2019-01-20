const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
    id: String,
    number: Number,
    words: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }],
    fillBlanks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FillBlank' }],
    sentences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sentence' }]
})

chapterSchema.statics.format = function(chapter) {
    return {
        id: chapter._id,
        number: chapter.number,
        words: chapter.words,
        fillBlanks: chapter.fillBlanks,
        sentences: chapter.sentences
      }
  }

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter
