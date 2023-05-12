//obtain queryClient from the app element props
const queryClient = document.getElementById('app').__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT;
const queryCache = queryClient.getQueryCache();
//querystorage holds the start time value at the key queryHash

const defaultStart = Date.now();

const queryStorage = new Map();
const callback = (event) => {
  // new query (either fresh or after invalidation)
  if(event.type === 'added'){
    // record start time
    queryStorage.set(event.query.queryHash, [Date.now(), ])
    messageWindow({ event, startTime: queryStorage.get(event.query.queryHash)[0], endTime: undefined, type: 'start' } );
  } else if((event.type === 'updated' && event.action.type === 'success')){
    let startTime, endTime;
    if(queryStorage.has(event.query.queryHash)){
      [startTime, endTime] = queryStorage.get(event.query.queryHash);
    } else {
      startTime = defaultStart;
    }
    //Query started, but no end time, so we know this update is the end
    if(!endTime){
      // record end time
      endTime = Date.now();
      queryStorage.set(event.query.queryHash, [startTime, endTime])
      messageWindow(
        { event, startTime, endTime, type: 'end' }
      );
      // end time already recorded, so cache hit
    } else {
      // return only time accessed
      startTime = endTime = Date.now();
      messageWindow({ event, startTime, endTime, type: 'cache' });
    }
  } 
}
const unsubscribe = queryCache.subscribe(callback)

// send from script.js to content.js
function messageWindow ({ event, startTime, endTime, type }) {
  // console.log('tidied event:\n', 
  //   { ...event, query: { ...event.query, cache: null, observers: null } }
  // );
  //useful information in cache and observer? but we cant include it here because of circular references
  window.postMessage({
    source: 'vueable-query-extension',
    payload: {
      startTime,
      endTime,
      type,
      //json parse and json stringify necessary because of error, cant send messages. Also remove circular references
      //https://stackoverflow.com/questions/42376464/uncaught-domexception-failed-to-execute-postmessage-on-window-an-object-co
      event: JSON.parse(JSON.stringify({ ...event, query: { ...event.query, cache: null, observers: null }}))
    }
  }, '*');
}
