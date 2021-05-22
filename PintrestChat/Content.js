
fetch(chrome.runtime.getURL('button.html')).then(r => r.text()).then(html => {
  document.body.insertAdjacentHTML('beforeend', html);
  // not using innerHTML as it would break js event listeners of the page
  document.getElementById('item-button').addEventListener("click", function () {
    
    chrome.storage.sync.get(["name"], function (result) {
      if (result.name != "") {
        console.log("Sent!!!");
        chrome.runtime.sendMessage({ message: "chatWindow" });
      }
      else {
        console.log("Not Sent");
         alert("Please enter your display name in the Pinterest Chat settings");
      }
  }); 
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "urll") {
    sendResponse({ urll: window.location.href });
  }
  else if (request.message == "hide") {
    document.getElementById("item-button").hidden = true;
  }
  else if (request.message == "show") {
    document.getElementById("item-button").hidden = false;
  }
  else if (request.message != "") {
    alert(request.message);
    sendResponse({ urll: null });
  }
  return true;
});
