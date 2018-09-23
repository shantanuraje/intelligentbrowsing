const express = require('express')
bodyParser = require('body-parser')
const app = express()
const boiler = require('boilerpipe-scraper')
const firebase = require("firebase");
let currentUser;
var config = {
    apiKey: "AIzaSyBKkNfGWAT0BJqks8CxszYkJbjogRzjUL0",
    authDomain: "bookmark-analyzer.firebaseapp.com",
    databaseURL: "https://bookmark-analyzer.firebaseio.com",
    projectId: "bookmark-analyzer",
    storageBucket: "bookmark-analyzer.appspot.com",
    messagingSenderId: "215698158184"
  };
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user.uid;
        console.log(currentUser);
        localStorage.setItem("uid",currentUser);            
    } else{
        currentUser = "Error";
    }
});
// Get a reference to the database service
const database = firebase.database();

console.log("hello");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// parse application/json
app.use(bodyParser.json({ limit: '10mb' }))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/retrieveUserBookmarks', function (req, res) {
    var userBookmarks = req.body;
    for (let i = 0; i < 5; i++) {
        const element = userBookmarks[i];
        boiler(userBookmarks[i]['url'], (err, text) => {
            if (err) console.log("Error")
            else {
                // console.log("Success")
                userBookmarks[i]['content'] = text;
                // console.log(text);
                uploadBookmarktoDB(userBookmarks[i]);

                // console.log(database);
                
                
            }
        })
    }
    // uploadBookmarkstoDB(userBookmarks);
    
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function uploadBookmarktoDB(userBookmark) {
    // console.log(database.ref());
    // var newBookmarkKey = database.ref().child('bookmarks').child(userBookmark);
    console.log("Hello", currentUser)
    // var updates = userBookmark;
    // console.log(updates);
    
    // return database.ref(firebase.auth().currentUser).push(userBookmark)

    // firebase.database().ref("bookmarks").push({
    //     username: "asd",
    //     email: "adasd",
    //     profile_picture : "imageUrl"
    //   });
    
}