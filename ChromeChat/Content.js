
//
//Adds content script to page.
//

fetch(chrome.runtime.getURL('button.html')).then(r => r.text()).then(injectHtml => {
  document.body.insertAdjacentHTML('beforeend', injectHtml);//inserts button.html into page
  // not using innerHTML as it would break js event listeners of the page
  document.getElementById('item-button').addEventListener("click", function () {
    chrome.storage.sync.get(["name"], function (result) {
      if (result.name != "" && result.name != null) {
        chrome.runtime.sendMessage({ message: "chatWindow" });//sends message to background.js to start opening window
      }
      else {
        alert("Please enter a display name in the Pinterest Chat settings");//error handling
      }
    });
  });

}).then(function () {
  runHiddenUpdate();
});



function runHiddenUpdate() {
  chrome.storage.sync.get(["isHidden"], function (result) {//sets check box to currently saved status
    if (result.isHidden == "true") {
      showHoveringButton(false);//updates hidden button status
    }
    else if (result.isHidden == "false") {
      showHoveringButton(true);
    }
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ('url' in request && 'title' in request) {//opens chat window
    let chatWindowWidth = 460;//Window size settings
    let chatWindowHeight = 620;
    openChatWindow(request.url, request.title, chatWindowWidth, chatWindowHeight);
  }
  else if (request.message == "pageURL") {//returns page url
    sendResponse({ pageURL: window.location.href });
  }
  else if (request.message == "hide") {//hides floating chat button
    showHoveringButton(false);
  }
  else if (request.message == "show") {//shows floating chat button
    showHoveringButton(true);
  }
  else if (request.message != "") {//Alerts user to any areas.
    alert(request.message);
    sendResponse({ pageURL: null });
  }
  return true;
});

function openChatWindow(pageURL, title, widthOfWindow, heightOfWindow) {
  var left = screen.width - widthOfWindow;//positions the window in the frame
  var top = screen.height - heightOfWindow;
  window.open(pageURL, title, "toolbar,location=no,focused=" + true + ",resizable=no,width=" + widthOfWindow + ",height=" + heightOfWindow + ",top=" + top + ",left=" + left);
  //opens page with particular properties
}

function showHoveringButton(isShown) {
  if (!isShown) {//hides floating chat button
    console.log("hidden button: " + Date.now());
    document.getElementById("item-button").style.display = "none";
  }
  else if (isShown) {//shows floating chat button
    console.log("showed button");
    document.getElementById("item-button").style.display = "block";
  }
}