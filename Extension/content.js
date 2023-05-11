//content script
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded',afterDOMLoaded);
} else {
  afterDOMLoaded();
}

function afterDOMLoaded(){
  console.log('Dom Content loaded')
  var script = document.createElement('script');
  script.src = chrome.runtime.getURL('script.js');
  script.onload = function() { this.remove(); };
  (document.head || document.documentElement).appendChild(script);


  //script.js -> here
  window.addEventListener('message', function(event) {
    // Only accept messages from the same frame
    if (event.source !== window) {
      return;
    }
  
    const message = event.data;
    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null ||
        message.source !== 'vueable-query-extension') {
      return;
    }
    
    // console.log('content.js received from script.js:', message);
    // console.log('content.js sending to background.js');
    // forward message to background.js
    chrome.runtime.sendMessage(message);
  });
}


