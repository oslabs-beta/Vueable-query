// content injects script to window, forwards messages to background.js, then background forwards them to devtool.js
const connections: {
  [tabId: string]: chrome.runtime.Port
} = {};
const histories: {
  [tabId: string]: Message[]
} = {};



chrome.runtime.onConnect.addListener(function (port) { // listen for new ports
  const extensionListener = function ({ name, tabId }: {name: string, tabId: string}) { // listen for messages
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (name === "init") {
      connections[tabId] = port;
      histories[tabId].forEach((request) => {
        connections[tabId].postMessage(request);
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
      const tabs: string[] = Object.keys(connections);
      for (let i = 0, length = tabs.length; i < length; i++) {
        if (connections[tabs[i]] === port) {
          delete connections[tabs[i]]
          break;
        }
      }
  });
});

// Receive message from content script and relay to the devTools page for the current tab
// content.js -> here -> devtool panel
chrome.runtime.onMessage.addListener(function(request, sender) {
  // Messages from content scripts should have sender.tab set
  if (sender.tab && sender.tab.id !== undefined) {
    const tabId = sender.tab.id;
    if (!Object.prototype.hasOwnProperty.call(histories, tabId)) histories[tabId] = [];
    histories[tabId].push(request);
    if (Object.prototype.hasOwnProperty.call(connections, tabId)) {
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});
