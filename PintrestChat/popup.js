var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {

    //
    //eventlistener setup
    //

    document.getElementById('chat-open').addEventListener('click', setup);//button event listener
    document.getElementById("showOpenChat").addEventListener('change', function () {
        if (document.getElementById("showOpenChat").checked == true) {
            sendMsg("show");
            chrome.storage.sync.set({ "hidden": "false" });
        }
        else {
            sendMsg("hide");
            chrome.storage.sync.set({ "hidden": "true" });
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
    chrome.storage.sync.get(["hidden"], function (result) {//sets check box to currently saved status
        if (result.hidden == "true") {
            document.getElementById("showOpenChat").checked = false;
        }
        else {
            document.getElementById("showOpenChat").checked = true;
        }
    });


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


