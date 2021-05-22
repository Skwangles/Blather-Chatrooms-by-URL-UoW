
fetch(chrome.runtime.getURL('button.html')).then(r => r.text()).then(html => {
  document.body.insertAdjacentHTML('beforeend', html);
  // not using innerHTML as it would break js event listeners of the page
  document.getElementById('item-button').addEventListener("click", function () {

    chrome.storage.sync.get(["name"], function (result) {
      if (result.name != "") {
        console.log("Sent - Contentjs");
        chrome.runtime.sendMessage({ message: "chatWindow" });
      }
      else {
        console.log("Not Sent - content js");
        alert("Please enter your display name in the Pinterest Chat settings");
      }
    });
  });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("recieved - Popup");
  
  console.log("recieved - Content js");
  if ( 'url' in request && 'title' in request) {
    console.log("url in request");
    let w = 400;
  let h = 520;
    openWindow(request.url, request.title, w, h);
  }
  else if (request.message == "urll") {
    sendResponse({ urll: window.location.href });
  }
  else if (request.message == "hide") {
    console.log("hidden button");
    document.getElementById("item-button").style.display = "none";
  }
  else if (request.message == "show") {
    console.log("showed button");
    document.getElementById("item-button").style.display = "block";
  }
  else if (request.message != "") {
    alert(request.message);
    sendResponse({ urll: null });
  }
  return true;
});

function openWindow(myUrl, title, w, h) {
  var left = screen.width - w;
  var top = screen.height - h;
  window.open(myUrl, title, "toolbar, location=yes,focused=" + true + ",resizable=no,width=" + w + ",height=" + h + ",top=" + top + ",left=" + left);
}