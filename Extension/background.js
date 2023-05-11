chrome.runtime.onInstalled.addListener(()=>{
  console.log("inside background script")
  //set up a listener for messages from content script
  //when message is received, trigger an action to update state
});
chrome.runtime.onMessage.addListener((message, sender, sendMessage)=>{
  console.log(message);
  console.log(sender);
  sendResponse("hello from background script")
})
