chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ "name": "" });
    chrome.storage.sync.set({ "user": "" });
    //
    //enter default url here
    //
    //chrome.storage.sync.set({ "serverurl": "" });
    
    chrome.storage.sync.set({ "userID": Date.now() });
});