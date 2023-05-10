console.log('hello world!')
const queryClient = document.getElementById('app').__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT
const queryCache = queryClient.getQueryCache()
console.log(queryCache)
let startTime, endTime;
const callback = (event) => {
  if(event.type === 'added'){
    startTime = Date.now();
    // console.log('API Query Started for', event.query.queryKey)
    messageWindow('API Query Started for' + event.query.queryKey.toString())
  }
  else if((event.type === 'updated' && event.action.type === 'success')){
    if(startTime){
      endTime = Date.now();
      messageWindow(`API Query Finished in ${((endTime - startTime) / 1000).toString()} s for ${event.query.queryKey.toString()}`);
      startTime = undefined;
    } else {
      messageWindow('Cache hit for ' +  event.query.queryKey.toString())
    }
  } 
}
const unsubscribe = queryCache.subscribe(callback)

function messageWindow (message) {
  window.postMessage({
    message: message,
    source: 'vueable-query-extension'
  }, '*');
}