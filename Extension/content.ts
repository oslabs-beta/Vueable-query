//content script - runs every time Chrome Extension is opened; runs on every page 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded',afterDOMLoaded);
} else {
  afterDOMLoaded();
}

function afterDOMLoaded(): void {
  // console.log('Dom Content loaded')
  const script = document.createElement('script'); // creates script element on the document 
  script.src = chrome.runtime.getURL('script.js'); // sets source to script.js; Chrome gives script.js a url 
  // @ts-ignore this is a script object?
  script.onload = function(): void { this.remove(); }; 
  (document.head || document.documentElement).appendChild(script); // append script to page
  // (script runs on the page and is the only scrip that has access to queryCache)


  
  //script.js -> here 
  //add a listener for messages from script.js
  window.addEventListener('message', function(event): void {
    // Only accept messages from the same frame
    if (event.source !== window) {
      return;
    }
    const message: Message = event.data;
    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null ||
        message.source !== 'vueable-query-extension') {
      return;
    }
    // forward message to background.js
    // console.log('content.js received from script.js:', message);
    try {
      chrome.runtime.sendMessage(message).catch(() => { //catch error if theres no response after sending a message
        console.log('Message has no response, please refresh the page');
      });
    } catch { // catch error if chrome.runtime can't be accessed
      console.log('Extension context invalidated, please refresh the page')
    }
  });
}


