document.addEventListener('DOMContentLoaded', function () {
  
  //eventlistener setup'
  
  document.querySelector('button').addEventListener('click', chatWindowSetup());    
  document.getElementById('user-name').addEventListener('change', function()
  {
    chrome.storage.sync.set({"name":document.getElementById("user-name").value});
  });
//not working?

chrome.runtime.onInstalled.addListener(function(details){
  chrome.storage.sync.set({"name":"anonymous"});
}) 

  //sets up the username
  if(document.getElementById("user-name").value == ""){
    chrome.storage.sync.get(["name"], function(result){
      if(result.value != "undefined"){
        document.getElementById("user-name").value = result.name; 
      }
      else{
        document.getElementById("user-name").value = "";
      }
   });
  }    
});

//defines item in storage



    //changes the saved name
    
    
    
    function chatWindowSetup() {
      document.getElementById("errors").innerHTML = "";
        
      console.log("Works");
        document.getElementById("errors").innerHTML = "";
      var myUrl = "https://youtube.com?b=" + passURL();
      console.log("CreateWindow");
      chrome.window.create({
        alwaysOnTop: true,
        focused: true,
        height: 350,
        width: 320,
        left: tab.innerWidth - width,
        top: tab.innerHeight - height,
        url: myUrl,
      type:"popup",
      });
    

    }
  
    function passURL() {// gets url to send to database
      return parseURL(window.location.href);
  }
  
  function parseURL(loc) {//removes the https://pintrest.nz part of the url
      loc = loc.replace("https", "");//covers both http and https
      loc = loc.replace("http", "");
      loc = loc.replace("://pintrest", "");//removes name so .com or .nz is at the front
      loc = loc.replace(".com", ".nz");//makes sure ending had two letters, so other countries ending can be chopped. i.e. .tv, .dk, etc
      var n = loc.indexOf("?");
      if (n >= 0) {
          loc.slice(0, n);//cuts any items with ?= on the end.
      }
      loc = loc.slice(3);//leaves just "/boardname/number" -- possibly hash
      return loc;
  }