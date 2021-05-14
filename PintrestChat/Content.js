
chrome.runtime.onMessage.addListener(messageRecieved);

function messageRecieved(request, sender, sendResponse) {
  if (request.message == "urll") {
    sendResponse({ urll: window.location.href });
  }
  else if (request.message != ""){
    alert(request.message);
    sendResponse({urll:null});
  }
  return true;
}
