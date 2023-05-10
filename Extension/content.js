//content script
console.log('hello world 4')

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded',afterDOMLoaded);
} else {
  afterDOMLoaded();
}

function afterDOMLoaded(){
  console.log('Dom Content loaded')
  
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('script.js');
  s.onload = function() { this.remove(); };
  (document.head || document.documentElement).appendChild(s);


  window.addEventListener('message', function(event) {
    // Only accept messages from the same frame
    if (event.source !== window) {
      return;
    }
  
    var message = event.data;
  
    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null ||
        message.source !== 'vueable-query-extension') {
      return;
    }
    
    console.log('content script heard window:', message);
//    chrome.runtime.sendMessage(message);
  });
}


