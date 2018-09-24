let userBookmarks  = [];
let serverURL = 'http://127.0.0.1:3000';

let uploadBookmarksButton = document.getElementById("upload-bookmarks");
let analyzeBookmarksButton = document.getElementById("analyze-bookmarks");


uploadBookmarksButton.addEventListener("click", () => getUserBookmarks());
analyzeBookmarksButton.addEventListener("click", () => analyzeUserBookmarks());

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
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", serverURL + "/uploadBookmarks", true);
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

function analyzeUserBookmarks() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", serverURL + "/preprocessBookmarks", true);
    xhttp.send();
}
// let loginButton = document.getElementById("login");
// let serverURL = 'http://127.0.0.1:3000'
// loginButton.addEventListener("click",function (e) {
//     let email = document.getElementById("email").value;
//     let password = document.getElementById("password").value;

//     console.log(email, password);

//     //create ajax request to sever to login
//     let httpRequest = new XMLHttpRequest();
//     httpRequest.open('POST', serverURL + '/login', true);
//     httpRequest.send();

//     httpRequest.onreadystatechange = function () {
//         if (httpRequest.readyState === XMLHttpRequest.DONE) {
//             if (httpRequest.status === 200) {
//                 console.log(httpRequest.responseText);
//                 location.href = ''
//             } else {
//                 console.log("Error");
//             }
//         }
//     }

// })