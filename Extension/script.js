console.log('hello world!')
const queryClient = document.getElementById('app').__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT
const queryCache = queryClient.getQueryCache()
console.log(queryCache)
let startTime, endTime;
const callback = (event) => {
  if(event.type === 'added'){
    console.log('whole dang event:', event);
    startTime = Date.now();
    // console.log('API Query Started for', event.query.queryKey)
    messageWindow('API Query Started for' + event.query.queryKey.toString(), event);
  }
  else if((event.type === 'updated' && event.action.type === 'success')){
    if(startTime){
      endTime = Date.now();
      messageWindow(
        `API Query Finished in ${((endTime - startTime) / 1000).toString()} s for ${event.query.queryKey.toString()}`,
        event
      );

      startTime = undefined;
    } else {
      messageWindow('Cache hit for ' +  event.query.queryKey.toString(), event);
    }
  } 
}
const unsubscribe = queryCache.subscribe(callback)

function messageWindow (message, event) {
  // console.log('tidied event:\n', 
  //   { ...event, query: { ...event.query, cache: null, observers: null } }
  // );
  
  //useful information in cache and observer? but we cant include it here because of circular references
  window.postMessage({
    message: message,
    source: 'vueable-query-extension',
    //json parse and json stringify necessary because of error, cant send messages
    //https://stackoverflow.com/questions/42376464/uncaught-domexception-failed-to-execute-postmessage-on-window-an-object-co
    event: JSON.parse(JSON.stringify({ ...event, query: { ...event.query, cache: null, observers: null }}))
  }, '*');
}
