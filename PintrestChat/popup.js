var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {

    //
    //eventlistener setup
    //
    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {//message reciever for the service worker
        console.log("recieved! - Popup.js");
        if (response.message == "hide") {
            document.getElementById("showOpenChat").checked = true;
        }
        else if (response.message == "show") {//any different message with open a popup
            document.getElementById("showOpenChat").checked = false;
        }
    });

    document.getElementById('chat-open').addEventListener('click', setup);//button event listener
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
    document.getElementById('user-name').addEventListener('change', function () {//updates textboxes when text changes
        chrome.storage.sync.set({ "name": document.getElementById("user-name").value });
    });
    document.getElementById('user-id').addEventListener('change', function () {
        chrome.storage.sync.set({ "user": document.getElementById("user-id").value });
    });



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

});
//
//End of DOM load
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


