var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {

    //
    //eventlistener setup
    //
   
    //
    //Button Even listener
    //
    document.getElementById('chat-open').addEventListener('click', emptyNameCheck);//button event listener

    //
    //Checkbox state update check and definition
    //
    document.getElementById("showOpenChat").addEventListener('change', function () {
        if (document.getElementById("showOpenChat").checked == true) {
            chrome.storage.sync.set({ "isHidden": "false" });
            passMessageToContent("show");
        }
        else {
            chrome.storage.sync.set({ "isHidden": "true" });
            passMessageToContent("hide");

        }
    });

    //
    //Check box update set
    //
    chrome.storage.sync.get(["isHidden"], function (result) {//sets check box to currently saved status
        if (result.isHidden == "true") {
            document.getElementById("showOpenChat").checked = false;
            console.log("hide check");
            passMessageToContent("hide");
        }
        else if (result.isHidden == "false") {
            document.getElementById("showOpenChat").checked = true;
            console.log("show check");
            passMessageToContent("show");
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
function passMessageToContent(mess) {
    let currentTabsSearchParameters =
    {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(currentTabsSearchParameters, function (tabs) {
        let msg = {
            message: mess
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}



function emptyNameCheck() {//checks for name otherwise fails
    chrome.storage.sync.get(["name"], function (result) {
        if (result.name != "") {
            chrome.runtime.sendMessage({ message: "chatWindow" });
        }
        else {
            chrome.runtime.sendMessage({ message: "Please enter a Display Name into the Pinterest Chat settings" });
        }
    });
}


