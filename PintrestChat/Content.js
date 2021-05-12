var myWindow;

document.addEventListener('DOMContentLoaded', function () {

  fetch(chrome.runtime.getURL('button.html')).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    // not using innerHTML as it would break js event listeners of the page
  });
  //eventlistener setup

  document.getElementById('chat-open').addEventListener('click', chatWindowSetup);

  document.getElementById('user-name').addEventListener('change', function () {
    chrome.storage.sync.set({ "name": document.getElementById("user-name").value });
  });
  //not working?

  chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.sync.set({ "name": "anonymous" });
  });

  //sets up the username
  if (document.getElementById("user-name").value == "") {
    chrome.storage.sync.get(["name"], function (result) {
      if (result.value != "undefined") {
        document.getElementById("user-name").value = result.name;
      }
      else {
        document.getElementById("user-name").value = "";
      }
    });
  }
});

//defines item in storage

function chatWindowSetup() {
  //
  //
  //CHANGE HEIGHT AND WIDTH HERE----------------------------
  //
  //
  let w = 320;
  let h = 350;
  var id = null;
 console.log(passURL);
  var myUrl = "https://localhost:44329?b=" + passURL() + "&n=" + document.getElementById("user-name").value+ "&id=" + id;
  var title = passURL() + " chat"
  openWindow(myUrl, title, w, h)
}

function openWindow(myUrl, title, w, h) {
  var left = screen.width - w;
  var top = screen.height - h;
  window.open(myUrl, title, "toolbar,focused=" + true + ",resizable=no,width=" + w + ",height=" + h + ",top=" + top + ",left=" + left);
}


function passURL() {// gets url to send to database
  return parseURL(window.location.href);
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