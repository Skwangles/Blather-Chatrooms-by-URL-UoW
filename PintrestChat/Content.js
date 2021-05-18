fetch(chrome.runtime.getURL('button.html')).then(r => r.text()).then(html => {
  document.body.insertAdjacentHTML('beforeend', html);
  // not using innerHTML as it would break js event listeners of the page
});

document.addEventListener('DOMContentLoaded', function () 
{
  
  document.getElementById("item-button").addEventListener('click', function () {
    console.log("recieved click");



  });
});


  chrome.runtime.onMessage.addListener(messageRecieved);

function messageRecieved(request, sender, sendResponse) {
  if (request.message == "urll") {
    sendResponse({ urll: window.location.href });
  }
  else if (request.message != "") {
    alert(request.message);
    sendResponse({ urll: null });
  }
  return true;
}
