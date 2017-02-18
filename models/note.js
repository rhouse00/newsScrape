const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }
},
    {
    timestamps: true
});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;