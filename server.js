//load environment config file
let config = require('./config.js');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const boiler = require('boilerpipe-scraper')
const nlp = require('compromise');
const natural = require('natural');

// require mongoose to connect to and work on MongoDB database
let mongoose = require('mongoose');
let bookmarkSchema = require('./bookmarkSchema.js');

let OriginalBookmark = mongoose.model('OriginalBookmark', bookmarkSchema, 'original-bookmarks');
let ModifiedBookmark = mongoose.model('ModifiedBookmark', bookmarkSchema, 'modified-bookmarks');

// setup connection with MongoDB according to environment
mongoose.connect(config["development"].db);
let db = mongoose.connection;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// parse application/json
app.use(bodyParser.json({ limit: '10mb' }))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/preprocessBookmarks', (req, res, next) => {
    console.log("Preprocess Bookmarks request");
    next();
}, preprocessBookmarks);

app.get('/analyzeBookmarks', (req, res, next) => {
    console.log("Analyze Bookmarks request");
    next();
}, analyzeBookmarks);

app.post('/login', (req, res) => {
    console.log("Login");
    res.send("Login request")
});

app.post('/uploadBookmarks', (req, res, next) => {
    console.log("Upload Bookmarks");
    console.log(req.body.slice(0,11));
    next();
    // extraxtContentBP(req.body);
}, extraxtContentBP);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

//middleware function
function extraxtContentBP(req, res) {
    req.body.forEach(bookmark => {
        boiler(bookmark.url, (err, text) => {
            if (err) console.log(err)
            else if(text !== "\r\n"){
                bookmark.content = text;
                console.log(req.body.indexOf(bookmark), bookmark.url);
                // next();
                uploadBookmarkToDB(bookmark);
            }
        })
    });
    res.send("Uploaded bookmarks to server");
}


function uploadBookmarkToDB(newBookmark) {
    OriginalBookmark.create(newBookmark, function (err, bookmark) {
        if (err) {
            console.log(err);
        }
    })
}

//middleware
function preprocessBookmarks(req, res) {
    console.log("Preprocess Bookmarks function");
    let text = '';
    OriginalBookmark.find({},function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            // console.log(docs);
            // docs.forEach(doc => {
            //     text += doc.content;
            // });
            let re = new RegExp(/[^A-Za-z ]/, 'gm')
            // text = text.replace(re, "");
            // console.log(text);
            // res.send(text)
            let temp;
            //run regex on each doc and update it
            docs.forEach(doc => {
                doc.content = doc.content.replace(re, "");
                // doc._id = new mongoose.Types.ObjectId();
                // delete doc.key;
                // temp = doc
                // console.log(doc);
                //find by id and update
                // OriginalBookmark.findByIdAndUpdate(doc._id, doc, function (err, doc) {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         // console.log(doc);
                //     }
                // });
                //create modified bookmark
                ModifiedBookmark.create(doc, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            });
            // res.send("Preprocessed bookmarks")
            res.send(temp)
        }
    }).lean();    
}

//middleware
function analyzeBookmarks(req, res) {
    console.log("Analyze Bookmarks function");
    let tokenizer = new natural.WordTokenizer();
    ModifiedBookmark.find({}, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            docs.forEach(doc => {
                doc.tokens = tokenizer.tokenize(doc.content);
                // console.log(tokenizer.tokenize(doc.content));
                // console.log(doc);
               
                // Bookmark.findById(doc._id, function (err, doc) {
                //     if (err) {
                //         console.log(err);
                //     }
                //     //create tokens for the first time
                //     doc.set({tokens: tokenizer.tokenize(doc.content)});
                //     doc.save(function (err, updatedBookmark) {
                //         if (err) {
                //             console.log(err);
                //         }else{
                //             console.log(updatedBookmark);
                //         }
                //     })

                // })
                ModifiedBookmark.findByIdAndUpdate(doc._id, doc, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
                // break;
            });
            res.send("Analyzed bookmarks")
        }
    }).lean(); //lean() gives a json document instead of mongodb document
    
}