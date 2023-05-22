// content injects script to window, forwards messages to background.js, then background forwards them to devtool.js
const connections = {};
let history = [];
let currentTabId;

// when a tab closes, if it's the tab with active history, clear history
chrome.tabs.onRemoved.addListener(
  (tabId: number): void => refreshHistoryConditionally(tabId, currentTabId)
);

/* when navigating to the page for any reason, if it's the tab with active */
/* history, clear history; this conditional includes reload. */
/* May want to always refresh history on any kind of re-access and replace */
/* onRemoved? */
chrome.webNavigation.onCommitted.addListener(
  ({ tabId, transitionType }): void => {
    if (['reload'].includes(transitionType)) {
      refreshHistoryConditionally(tabId, currentTabId)
    }
  }
);

chrome.runtime.onConnect.addListener(function (port: number): void { // listen for new ports
//    console.log('On connect add listener')
    const extensionListener = function (message: object, _sender, _sendResponse) { // listen for messages
      // The original connection event doesn't include the tab ID of the
      // DevTools page, so we need to send it explicitly.
      if (message.name == "init") {
        currentTabId = message.tabId; //assign current tab Id to the tab Id vue query tool is in 
        connections[currentTabId] = port;
//        console.log('Sending history over for new connection', history)
        history.forEach((request: object): void => {
          connections[currentTabId].postMessage(request);
        });
        return;
      }
	// other message handling
    }
    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);
    // handle disconnect
    port.onDisconnect.addListener(function(port: number): void {
        port.onMessage.removeListener(extensionListener);
        const tabs = Object.keys(connections);
        for (const i = 0, length = tabs.length; i < length; i++) {
          if (connections[tabs[i]] === port) {
            delete connections[tabs[i]]
            break;
          }
        }
    });
});

// Receive message from content script and relay to the devTools page for the current tab
// content.js -> here -> devtool panel
chrome.runtime.onMessage.addListener(function(request: object, sender: object, _sendResponse): boolean {
    // Messages from content scripts should have sender.tab set
    history.push(request);
    if (sender.tab) {
      const tabId = sender.tab.id;
      if (tabId in connections) {
//        console.log("Background.js: posting message to devtool panel", history);
        connections[tabId].postMessage(request);
      } else {
        console.log("Tab not found in connection list.");
      }
    } else {
      console.log("sender.tab not defined.");
    }
    return true;
});

function refreshHistoryConditionally (tabId: number, currentTabId: number): void {
  if (tabId === currentTabId) {
//    console.log('wiping history, of', history);
    history = [];
//    console.log('wiped to:', history)
    // send message to devTool store to reset
    // could also reset startTime
    connections[tabId].postMessage({
      source: 'vueable-query-extension',
      payload: {
        startTime: Date.now(),
        type: 'resetHistory',
      }
    });
  }
}