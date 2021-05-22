chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.sync.set({
        "user": "",
        "name": "",
        "userID": Date.now()
    });
    
});

document.addEventListener("DOMContentLoaded", function(){
    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
        console.log("recieved!");
        if (response.message == "chatWindow") {
            chatWindowSetup();
            
        }
        else if (response.message != "") {
            console.log("Alert");
            sendAlert(response.message);
        }
    });
});



async function urlGet() {//takes the url
    //var server = "";//defautl url
    // chrome.storage.sync.get(['serverurl'], function(result){
    //     if(result.serverurl != "")
    //     server = result.serverurl;
    //     else{
    //         server = "localhost:4321"
    //     }
    // })
    console.log(getID());
    console.log(getName());
    let params =
    {
        active: true,
        currentWindow: true
    }
    var name = await getName();
    var myID = await getID();

    chrome.tabs.query(params, function (tabs) {

        let msg = {
            message: 'urll'
        }

        chrome.tabs.sendMessage(tabs[0].id, msg, {}, function (response) {

            var myUrl = "https://more-pinteresting.web.app/" + "?" + "b=" + parseURL(response.urll) + "&" + "n=" + name + "&id=" + myID;
            var title = parseURL(myUrl) + " chat";
            chrome.runtime.sendMessage({url:myUrl, title:title});

        });


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

//defines item in storage

function chatWindowSetup() {
    //If empty, return alert.
    console.log("setups");
    urlGet();
}
//parseURL(urlGet('url'))



function parseURL(loc) {//removes the https://pintrest.nz part of the url
    loc = loc.replace("https", "");//covers both http and https
    loc = loc.replace("http", "");
    //loc = loc.replace("://pintrest", "");//removes name so .com or .nz is at the front
    //loc = loc.replace(".com", ".nz");//
    var n = loc.indexOf("?");
    if (n >= 0) {
        loc.slice(0, n);//cuts any items with ?= on the end.
    }
    //loc = loc.slice(3);//leaves just "/boardname/number" -- possibly hash
    return loc;
}