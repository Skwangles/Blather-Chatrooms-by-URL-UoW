var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {

    //
    //eventlistener setup
    //
   
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

    //
    //Check box update set
    //
    chrome.storage.sync.get(["hidden"], function (result) {//sets check box to currently saved status
        if (result.hidden == "true") {
            document.getElementById("showOpenChat").checked = false;
            console.log("hide check");
            sendMsg("hide");
        }
        else if (result.hidden == "false") {
            document.getElementById("showOpenChat").checked = true;
            console.log("show check");
            sendMsg("show");
        }
    });


    //
    //Textboxes state update check and definition
    //
    document.getElementById('user-name').addEventListener('change', function () {//updates textboxes when text changes
        chrome.storage.sync.set({ "name": document.getElementById("user-name").value });
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
    //Checkbox initial state setter
    //
   

    //
    //Just in case background doesn't fire. Update here
    //
    
});
//
//End of DOM load event listener
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


