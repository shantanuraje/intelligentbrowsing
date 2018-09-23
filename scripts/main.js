
var userBookmarks = []
var serverURL = "http://127.0.0.1:3000"
class Bookmark {
    constructor(title, url, content) {
        this.title = title;
        this.url = url;
        this.content = content;
    }
}

$("#analyzeBookmarks").click(function() {
    getUserBookmarks()
  });

function getUserBookmarks() {
    chrome.bookmarks.getTree(function (bookmarkTree) {
        console.log(bookmarkTree['0']['children']);
        for (let i = 0; i < bookmarkTree['0']['children'].length; i++) {
            const bookmarkFolder = bookmarkTree['0']['children'][i]['children'];
            // console.log(bookmarkFolder);
            for (let j = 0; j < bookmarkFolder.length; j++) {
                const bookmark = bookmarkFolder[j];
                if (isValidUrl(bookmark['url'])) {
                    const validBookmark = new Bookmark(bookmark['title'], bookmark['url'], "")
                    userBookmarks.push(validBookmark);
                } else {
                    continue;
                }
            }

        }
        console.log(userBookmarks);
        postUserBookmarks(userBookmarks);

    })
}

function postUserBookmarks(userBookmarks) {
    console.log(firebase.auth().currentUser);
    console.log(userBookmarks);
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", serverURL + "/retrieveUserBookmarks", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(userBookmarks));
}
const isValidUrl = (string) => {
    try {
        if (string.startsWith("javascript:")) {
            return false;
        }else{
            new URL(string);
            return true;
        }
    } catch (_) {
        return false;
    }
}