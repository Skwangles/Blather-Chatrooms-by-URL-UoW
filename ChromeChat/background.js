chrome.runtime.onInstalled.addListener(function () {//sets up default values for user information
    chrome.storage.sync.set({
        "name": "",//display name
        "userID": Date.now().toString() + Math.ceil(Math.random()*100).toString(),//gives a random number to the user.
        "hidden": "true"//defines if hovering button is hidden
    });
});//defines default values

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {//message reciever for the service worker
    console.log("recieved! - Background");
    if (response.message == "chatWindow") {
        processURL();
    }
    else if (response.message != "") {//any different message with open a popup
        console.log("Alert");
        sendAlert(response.message);
    }
});

chrome.storage.sync.get(["hidden"], function (result) {//sets check box to currently saved status
    if (result.hidden == "true") {
        passMessageToContent("show");//updates hidden button status
    }
    else if (result.hidden == "false") {
        passMessageToContent("hide");
    }
});


async function processURL() {//gets the url of page and parses the URL
    let params =
    {
        active: true,
        currentWindow: true
    }
    var serverUrl = "https://pinterestingvc.web.app/";//url of chat window

    var name = await getName();//gets the name and id stored in chrome memory - waits until retrieved
    var myID = await getID();

    chrome.tabs.query(params, function (tabs) {

        let msg = {
            message: 'pageURL'
        }
        chrome.tabs.sendMessage(tabs[0].id, msg, {}, function (response) {
            try {
                var urlToOpen = serverUrl + "?" + "b=" + parseURL(response.pageURL) + "&" + "n=" + name + "&id=" + myID;//formulates board id, username and id
                var title = parseURL(urlToOpen) + " chat";
            }
            catch {
                var urlToOpen = serverUrl + "?" + "b=" + "default" + "&" + "n=" + name + "&id=" + myID;
                var title = "Default chat"
            }
            console.log("sending open request");
            chrome.tabs.sendMessage(tabs[0].id, { url: urlToOpen, title: title });//Tells Content script to open new window

        });
    });

}

function parseURL(urlString) {//removes the https:// part of the url so differences in security don't influence url
    urlString = urlString.replace("https://", "");//covers both http and https
    urlString = urlString.replace("http://", "");
    //---Remove if wanting to use url variables in chat id - e.g. youtube
    var locationOfQMark = urlString.indexOf("?");
    if (locationOfQMark >= 0) {
        urlString = urlString.slice(0, locationOfQMark);//cuts any items with ?= - to eliminate specific differences between users
    }
    //---
    return urlString;
}


async function getName() {//gets the name stored in memory 
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(["name"], function (result) {
                if (result.name != "" && result.name != null) {
                    resolve(result.name);
                }
                else {
                    resolve("Anonymous");//error handling
                }
            });
        } catch {
            reject("Anonymous");
        }
    });
}

async function getID() {//gets the user id stored in memory
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(["userID"], function (result) {
                if (result.userID != "" && result.userID != null) {
                    resolve(result.userID);
                }
                else {
                    resolve("Anonymous");//error handling
                }
            });
        } catch {
            reject("Anonymous");
        }
    });
}


function sendAlert(message) {//sends an alert to the browser
    let currentTabsSearchParameters =
    {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(currentTabsSearchParameters, function (tabs) {

        let msg = {
            message: message
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}

function passMessageToContent(passMessage) {//sends a message between scripts
    let currentTabsSearchParameters =
    {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(currentTabsSearchParameters, function (tabs) {
        let msg = {
            message: passMessage
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}
