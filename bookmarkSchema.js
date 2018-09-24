let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bookmarkSchema = new Schema({
    title: String,
    url: String,
    content: String
});

module.exports = bookmarkSchema;