var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {

   

    //
    //eventlistener setup
    //

    document.getElementById('chat-open').addEventListener('click', chatWindowSetup);//button event listener

    document.getElementById('user-name').addEventListener('change', function () {//updates textboxes when text changes
        chrome.storage.sync.set({ "name": document.getElementById("user-name").value });
    });
    document.getElementById('user-id').addEventListener('change', function () {
        chrome.storage.sync.set({ "user": document.getElementById("user-id").value });
    });
    // document.getElementById('server-url').addEventListener('change', function () {
    //     chrome.storage.sync.set({ "serverurl": document.getElementById("server-url").value });
    // });


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

    // if (document.getElementById("server-url").value == "") {//sets url value to currently saved values
    //     chrome.storage.sync.get(["serverurl"], function (result) {
    //         if (result.serverurl != "") {
    //             document.getElementById("server-url").value = result.serverurl;
    //         }
    //         else {
    //             document.getElementById("server-url").value = "";
    //         }
    //     });
    // }

});


async function urlGet() {//takes the url

    let w = 400;
    let h = 500;
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
                var myUrl = "https://more-pinteresting.web.app/" + "?" + "b=" + response.urll + "&" + "n=" + name + "&id=" + myID;
                var title = parseURL(myUrl) + " chat";
                openWindow(myUrl, title, w, h);

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
                if (document.getElementById("user-name").value != "")
                    resolve(document.getElementById("user-name").value);
                else if (result.name != "" && result.name != null) {
                    resolve(result.name);
                }
                else {
                    resolve("Anonymous");
                }
            });
        } catch (ex) {
            reject(ex)
        }
    });
}

async function getID() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(["userID"], function (result) {
                if (document.getElementById("user-id").value != "")
                    resolve(document.getElementById("user-id").value);
                else if (result.userID != "" && result.userID != null) {
                    resolve(result.userID);
                }
                else {
                    resolve("Anonymous");
                }
            });
        } catch (ex) {
            reject(ex)
        }
    });
}

//defines item in storage

function chatWindowSetup() {
    //If empty, return alert.
    if (document.getElementById("user-name").value == "") {
        sendAlert("You must enter a display name");
        return;
    }
    urlGet();
}
//parseURL(urlGet('url'))

function openWindow(myUrl, title, w, h) {
    var left = screen.width - w;
    var top = screen.height - h;
    window.open(myUrl, title, "toolbar, location=yes,focused=" + true + ",resizable=no,width=" + w + ",height=" + h + ",top=" + top + ",left=" + left);
}

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