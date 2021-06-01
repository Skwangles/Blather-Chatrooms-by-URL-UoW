chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        "user": "",
        "name": "",
        "userID": Date.now(),//gives a random number, based on the very second you install the extension
        "hidden": "true"
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
        console.log("show check");
        sendMsg("show");
    }
    else if (result.hidden == "false") {
        console.log("hide check");
        sendMsg("hide");
    }
});


async function processURL() {//gets the url of page and parses the URL
    let params =
    {
        active: true,
        currentWindow: true
    }
    // var serverUrl = "https://more-pinteresting.web.app/";
    var serverUrl = "https://project-5ab8d.web.app/";
    var name = await getName();//gets the name and id stored in chrome memory
    var myID = await getID();

    chrome.tabs.query(params, function (tabs) {

        let msg = {
            message: 'urll'
        }
        chrome.tabs.sendMessage(tabs[0].id, msg, {}, function (response) {
            try {
                var myUrl = serverUrl + "?" + "b=" + parseURL(response.urll) + "&" + "n=" + name + "&id=" + myID;//formulates board id, username and id
                var title = parseURL(myUrl) + " chat";
            }
            catch {
                var myUrl = serverUrl + "?" + "b=" + "default" + "&" + "n=" + name + "&id=" + myID;
                var title = "Default chat"
            }
            console.log("sending open request");
            chrome.tabs.sendMessage(tabs[0].id, { url: myUrl, title: title });//Tells Content script to open new window

        });
    });

}

function parseURL(loc) {//removes the https://pintrest.nz part of the url
    loc = loc.replace("https://", "");//covers both http and https
    loc = loc.replace("http://", "");
    //---Remove if wanting to use url variables in chat id
    var n = loc.indexOf("?");
    if (n >= 0) {
        loc = loc.slice(0, n);//cuts any items with ?= on the end.
    }
    //---
    return loc;
}


async function getName() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(["name"], function (result) {
                if (result.name != "" && result.name != null) {
                    resolve(result.name);
                }
                else {
                    resolve("Anonymous");
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function getID() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(["userID"], function (result) {
                // if (document.getElementById("user-id").value != "")
                //     resolve(document.getElementById("user-id").value);
                if (result.userID != "" && result.userID != null) {
                    resolve(result.userID);
                }
                else {
                    resolve("Anonymous");
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
}


function sendAlert(message) {
    let params =
    {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(params, function (tabs) {

        let msg = {
            message: message
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}

function sendMsg(mess) {
    let params =
    {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(params, function (tabs) {
        let msg = {
            message: mess
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}
