chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
if (request.message == "url")
sendResponse({url: window.location.href});
});
