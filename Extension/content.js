//content script
console.log("inside content script")
chrome.runtime.sendMessage(
  // {queryKey:"newQueryKey", newData:"newdata"},
  // function(response) {
  //   console.log(response.farewell)
  // }
  "hello from content script",
  function(response) {
    console.log(response)
  }
)