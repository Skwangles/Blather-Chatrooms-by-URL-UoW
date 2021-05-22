var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {


    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
        let w = 400;
        let h = 520;
        if (response != null && response.url != "" && response.url != null && response.title != "" && response.title != null) {
            openWindow(response.url, response.title, w, h)
        }
    });
    //
    //eventlistener setup
    //

    document.getElementById('chat-open').addEventListener('click', setup);//button event listener

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

function setup() {
    chrome.storage.sync.get(["name"], function (result) {
        if (result.name != "") {
            console.log("Send!!!");
            chrome.runtime.sendMessage({ message: "chatWindow" });
        }
        else {
            chrome.runtime.sendMessage({ message: "Please enter a Display Name into the Pinterest Chat settings" });
        }
    });
}

function openWindow(myUrl, title, w, h) {
    var left = screen.width - w;
    var top = screen.height - h;
    window.open(myUrl, title, "toolbar, location=yes,focused=" + true + ",resizable=no,width=" + w + ",height=" + h + ",top=" + top + ",left=" + left);
}
