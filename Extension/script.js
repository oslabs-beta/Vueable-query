//obtain queryClient from the app element props
const queryClient = document.getElementById('app').__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT;
const queryCache = queryClient.getQueryCache();
//querystorage holds the start time value at the key queryHash
const queryStorage = new Map();
const callback = (event) => {
  if(event.type === 'added'){
    // console.log('whole dang event:', event);
    queryStorage.set(event.query.queryHash, Date.now())
    //Query Start
    messageWindow({ event, startTime: queryStorage.get(event.query.queryHash), endTime: undefined, type: 'start' } );
  }
  else if((event.type === 'updated' && event.action.type === 'success')){
    if(queryStorage.has(event.query.queryHash)){
      const endTime = Date.now();
      //Query End
      messageWindow(
        { event, startTime: queryStorage.get(event.query.queryHash), endTime, type: 'end' }
      );
      queryStorage.remove(event.query.queryHash);
    } else {
      //Query Start, Cache hit
      startTime = endTime = Date.now();
      messageWindow({ event, startTime, endTime, type: 'cache' });
    }
  } 
}
const unsubscribe = queryCache.subscribe(callback)

//script.js -> content.js
function messageWindow ({ event, startTime, endTime, type }) {
  // console.log('tidied event:\n', 
  //   { ...event, query: { ...event.query, cache: null, observers: null } }
  // );
  //useful information in cache and observer? but we cant include it here because of circular references
  window.postMessage({
    source: 'vueable-query-extension',
    message: {
      startTime,
      endTime,
      type,
      //json parse and json stringify necessary because of error, cant send messages. Also remove circular references
      //https://stackoverflow.com/questions/42376464/uncaught-domexception-failed-to-execute-postmessage-on-window-an-object-co
      event: JSON.parse(JSON.stringify({ ...event, query: { ...event.query, cache: null, observers: null }}))
    }
  }, '*');
}
