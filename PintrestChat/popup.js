var pageURL = "";
document.addEventListener('DOMContentLoaded', function () {

    // fetch(chrome.runtime.getURL('button.html')).then(r => r.text()).then(html => {
    //     document.body.insertAdjacentHTML('beforeend', html);
    //     // not using innerHTML as it would break js event listeners of the page
    // });

    //
    //eventlistener setup
    //

    document.getElementById('chat-open').addEventListener('click', chatWindowSetup);

    document.getElementById('user-name').addEventListener('change', function () {
        chrome.storage.sync.set({ "name": document.getElementById("user-name").value });
    });
    document.getElementById('user-id').addEventListener('change', function () {
        chrome.storage.sync.set({ "user": document.getElementById("user-id").value });
    });
    //
    //sets up the username
    //
    if (document.getElementById("user-name").value == "") {
        chrome.storage.sync.get(["name"], function (result) {
            if (result.value != "") {
                document.getElementById("user-name").value = result.name;
            }
            else {
                document.getElementById("user-name").value = "";
            }
        });
    }

    if (document.getElementById("user-id").value == "") {
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

function urlGet(message) {

    let params =
    {
        active: true,
        currentWindow: true
    }

    chrome.tabs.query(params, function (tabs) {

        let msg = {
            message: message
        }
        chrome.tabs.sendMessage(tabs[0].id, msg, {}, function (response) {
            if(message == "url"){
            pageURL = parseURL(response.url);
            console.log("pg"+ pageURL);
            console.log(response);
            }
           
           
            

        });
    });

}


//defines item in storage

function chatWindowSetup() {
    //
    //
    //---------------Height, Width and Server name----------------------------
    //
    if (document.getElementById("user-name").value == "") {
        urlGet("You must enter a display name");
        return;
    }
    let w = 320;
    let h = 350;
    let server = "https://myWebsite";

    //If no user name is entered, use chrome extension's 
    var id = '';
    chrome.storage.sync.get(['userID'], function (result) {
        id = result;
    });
    if (document.getElementById("user-id").value != "") {
        id = document.getElementById("user-id").value;
    }
    //
    //Window Creation
    //
    urlGet('url')
    var myUrl = server + "?" + "b=" + pageURL + "&" + "n=" + document.getElementById("user-name").value + "&id=" + id;
    var title = passURL() + " chat";
    openWindow(myUrl, title, w, h);
    
}
//parseURL(urlGet('url'))

function openWindow(myUrl, title, w, h) {
    var left = screen.width - w;
    var top = screen.height - h;
    window.open(myUrl, title, "toolbar, location=yes,focused=" + true + ",resizable=no,width=" + w + ",height=" + h + ",top=" + top + ",left=" + left);
}


function passURL() {// gets url to send to database
    
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