const connections = {};
let history = [];
let currentTabId;
chrome.runtime.onConnect.addListener(function (port) {
    console.log('On connect add listener')
    const extensionListener = function (message, sender, sendResponse) {
      // The original connection event doesn't include the tab ID of the
      // DevTools page, so we need to send it explicitly.
      if (message.name == "init") {
        currentTabId = message.tabId;
        connections[message.tabId] = port;
        console.log('Sending history over for new connection')
        history.forEach((request) => {
          connections[message.tabId].postMessage(request);
        });
        return;
      }
	// other message handling
    }
    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);
    // handle disconnect
    port.onDisconnect.addListener(function(port) {
        port.onMessage.removeListener(extensionListener);
        const tabs = Object.keys(connections);
        for (const i=0, len=tabs.length; i < len; i++) {
          if (connections[tabs[i]] == port) {
            delete connections[tabs[i]]
            break;
          }
        }
    });
});
// Receive message from content script and relay to the devTools page for the current tab
// content.js -> here -> devtool panel
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Messages from content scripts should have sender.tab set
    history.push(request);
    if (sender.tab) {
      const tabId = sender.tab.id;
      if (tabId in connections) {
        // console.log("Background.js: posting message to devtool panel");
        connections[tabId].postMessage(request);
      } else {
        console.log("Tab not found in connection list.");
      }
    } else {
      console.log("sender.tab not defined.");
    }
    return true;
});

// when a tab closes, if it's the tab with active history, clear history
chrome.tabs.onRemoved.addListener(
  (tabId) => refreshHistoryConditionally(tabId, currentTabId)
);

/* when navigating to the page for any reason, if it's the tab with active */
/* history, clear history; this conditional includes reload. */
/* May want to always refresh history on any kind of re-access and replace */
/* onRemoved? */
chrome.webNavigation.onCommitted.addListener(
  ({ tabId, transitionType }) => {
    if (['reload'].includes(transitionType)) {
      refreshHistoryConditionally(tabId, currentTabId)
    }
  }
);

function refreshHistoryConditionally (tabId, currentTabId) {
  if (tabId === currentTabId) {
    console.log('wiping history');
    history = [];
    // send message to devTool store to reset
    // could also reset startTime
  }
}
