
//
//Adds content script to page.
//
fetch(chrome.runtime.getURL('button.html')).then(r => r.text()).then(html => {
  document.body.insertAdjacentHTML('beforeend', html);
  // not using innerHTML as it would break js event listeners of the page
  document.getElementById('item-button').addEventListener("click", function () {
    chrome.storage.sync.get(["name"], function (result) {
      if (result.name != "" && result.name != null) {
        chrome.runtime.sendMessage({ message: "chatWindow" });
      }
      else {
        alert("Please enter a display name in the Pinterest Chat settings");//error handling
      }
    });
  });
});


//Button doesn't load upon page refresh. Needs status update by clicking extension icon.
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status == 'complete') {
//     chrome.storage.sync.get(["hidden"], function (result) {//sets check box to currently saved status
//       if (result.hidden == "false") {
//         showButton(true);
//       }
//       else if (result.hidden == "true") {
//         showButton(false);
//       }
//     });
//   }
// })


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ('url' in request && 'title' in request) {//opens chat window
    let chatWindowWidth = 460;//Window size settings
    let chatWindowHeight = 620;
    openChatWindow(request.url, request.title, chatWindowWidth, chatWindowHeight);
  }
  else if (request.message == "urll") {//returns page url
    sendResponse({ urll: window.location.href });
  }
  else if (request.message == "hide") {//hides floating chat button
    showHoveringButton(false);
  }
  else if (request.message == "show") {//shows floating chat button
    showHoveringButton(true);
  }
  else if (request.message != "") {//Alerts user to any areas.
    alert(request.message);
    sendResponse({ urll: null });
  }
  return true;
});

function openChatWindow(myUrl, title, w, h) {
  var left = screen.width - w;
  var top = screen.height - h;
  window.open(myUrl, title, "toolbar, location=no,focused=" + true + ",resizable=no,width=" + w + ",height=" + h + ",top=" + top + ",left=" + left);
}

function showHoveringButton(isShown) {
  if (!isShown) {//hides floating chat button
    console.log("hidden button");
    document.getElementById("item-button").style.display = "none";
  }
  else if (isShown) {//shows floating chat button
    console.log("showed button");
    document.getElementById("item-button").style.display = "block";
  }
}