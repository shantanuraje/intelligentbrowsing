//load environment config file
let config = require('./config.js');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const boiler = require('boilerpipe-scraper')
const nlp = require('compromise');
// require mongoose to connect to and work on MongoDB database
let mongoose = require('mongoose');
let bookmarkSchema = require('./bookmarkSchema.js');

let Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// setup connection with MongoDB according to environment
mongoose.connect(config["development"].db);
let db = mongoose.connection;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// parse application/json
app.use(bodyParser.json({ limit: '10mb' }))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/preprocessBookmarks', (req, res) => {
    console.log("Preprocess Bookmarks request");
    preprocessBookmarks();
    res.send("Ok");

});


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
    // res.send("Done");
}


function uploadBookmarkToDB(newBookmark) {
    Bookmark.create(newBookmark, function (err, bookmark) {
        if (err) {
            console.log(err);
        }
    })
}

function preprocessBookmarks() {
    console.log("Preprocess Bookmarks function");
    let text = '';
    Bookmark.find({},function (err, docs) {
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

            //run regex on each doc and update it
            docs.forEach(doc => {
                doc.content = doc.content.replace(re, "");
                console.log(doc);
                //find by id and update
                Bookmark.findByIdAndUpdate(doc._id, doc, function (err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(doc);
                    }
                });
            });
            res.send("Ok")
        }
    } )    
}