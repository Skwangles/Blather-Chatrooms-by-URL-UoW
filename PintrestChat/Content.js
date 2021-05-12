
chrome.runtime.onMessage.addListener(messageRecieved);

function messageRecieved(request, sender, sendResponse) {
  if (request.message == "url") {
    sendResponse({ url: window.location.href });
  }
  else if (request.message != ""){
    alert(request.message);
    sendResponse({url:null});
  }
  return true;
}
