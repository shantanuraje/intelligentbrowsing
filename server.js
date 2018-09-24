//load environment config file
let config = require('./config.js');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const boiler = require('boilerpipe-scraper')

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