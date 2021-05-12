chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ "name": "" });
    chrome.storage.sync.set({ "user": "" });
    chrome.storage.sync.set({ "userID": Date.now() });
    

    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {

    //       if (request.message == "id")
    //         chrome.storage.sync.get(['userID'], function(result){
    //             sendResponse({id: result});
    //         })
    //     }
    //   );
});