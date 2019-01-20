const mongoose = require('mongoose')

const fillBlankSchema = new mongoose.Schema({
    id: String,
    sentence: String,
    translation: String,
    blankLength: Number,
    difficulty: String,
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }
})

fillBlankSchema.statics.format = function(fillBlank) {
    return {
        id: fillBlank._id,
        sentence: fillBlank.sentence,
        translation: fillBlank.translation,
        blankLength: fillBlank.blankLength,
        difficulty: fillBlank.difficulty,
        chapter: fillBlank.chapter
      }
  }

const FillBlank = mongoose.model('FillBlank', fillBlankSchema);

module.exports = FillBlank