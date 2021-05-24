var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {

    //
    //eventlistener setup
    //
    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {//message reciever for the popup
        console.log("recieved! - Popup.js");

        if (response.order == "true") {
            document.getElementById("showOpenChat").checked = true;
        }
        else if (response.order == "false") {
            document.getElementById("showOpenChat").checked = false;
        }
    });


    //
    //Button Even listener
    //
    document.getElementById('chat-open').addEventListener('click', setup);//button event listener

    //
    //Checkbox state update check and definition
    //
    document.getElementById("showOpenChat").addEventListener('change', function () {
        if (document.getElementById("showOpenChat").checked == true) {
            chrome.storage.sync.set({ "hidden": "false" });
            sendMsg("show");
        }
        else {
            chrome.storage.sync.set({ "hidden": "true" });
            sendMsg("hide");

        }
    });

    //Advanced setting state update check and definition
    document.getElementById("showUsername").addEventListener('change', function () {
        if (document.getElementById("showUsername").checked == true) {
            chrome.storage.sync.set({ "advanced": "false" });
            document.getElementById("user-id").style.display = "none";
        }
        else {
            chrome.storage.sync.set({ "advanced": "true" });
            document.getElementById("user-id").style.display = "block";

        }
    });

    //
    //Textboxes state update check and definition
    //
    document.getElementById('user-name').addEventListener('change', function () {//updates textboxes when text changes
        chrome.storage.sync.set({ "name": document.getElementById("user-name").value });
    });
    document.getElementById('user-id').addEventListener('change', function () {
        chrome.storage.sync.set({ "user": document.getElementById("user-id").value });
    });


    //
    //Text boxes initial state setter
    //
    if (document.getElementById("user-name").value == "") {//sets display name to currently saved value
        chrome.storage.sync.get(["name"], function (result) {
            if (result.value != "") {
                document.getElementById("user-name").value = result.name;
            }
            else {
                document.getElementById("user-name").value = "";
            }
        });
    }

    //
    //Text boxes initial state setter
    //
    if (document.getElementById("user-id").value == "") {//sets username value to currently save value
        chrome.storage.sync.get(["user"], function (result) {
            if (result.user != "") {
                document.getElementById("user-id").value = result.user;
            }
            else {
                document.getElementById("user-id").value = "";
            }
        });
    }

    //
    //Checkbox initial state setter
    //
    chrome.storage.sync.get(["hidden"], function (result) {//sets check box to currently saved status
        if (result.hidden == "true") {
            document.getElementById("showOpenChat").checked = false;
        }
        else if (result.hidden == "false") {
            document.getElementById("showOpenChat").checked = true;
        }
    });
    chrome.storage.sync.get(["advanced"], function (result) {//sets check box to currently saved status
        if (result.advanced == "true") {
            document.getElementById("showUsername").checked = false;
            document.getElementById("user-id").style.display = "none";
        }
        else if (result.advanced == "false") {
            document.getElementById("showUsername").checked = true;
            document.getElementById("user-id").style.display = "block";
        }
    });

});
//
//End of DOM load
//

//
//Send message to content.js
//
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


//
//Checks for name and alerts
//
function setup() {
    chrome.storage.sync.get(["name"], function (result) {
        if (result.name != "") {
            console.log("Sent - popup!!!");
            chrome.runtime.sendMessage({ message: "chatWindow" });
        }
        else {
            console.log("Popup-no name");
            chrome.runtime.sendMessage({ message: "Please enter a Display Name into the Pinterest Chat settings" });
        }
    });
}


