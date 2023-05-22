if(!(window.__VUE__)){ // check if Vue is running
  console.log('Vueable Query Error: Vue app not detected');
} else if(getQueryClient()) { // check if Tanstack Query is running
  console.log('Vueable Query: Tanstack Query client found');
  
  //rest of program goes here
  const queryClient = getQueryClient();
  //document.getElementById('app').__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT; //extracting queryClient then assign to a constant
  const queryCache = queryClient.getQueryCache(); // central cache that we attach observer to 

  //querystorage holds the start time value at the key queryHash

  const defaultStart = Date.now(); //once script loads, set a default start time
  //send message with the default start time
  window.postMessage({ // post message to window that the webpage is on (chrome window)
    source: 'vueable-query-extension', // our extension
    payload: {
      startTime: defaultStart,
      type: 'pageStartTime' 
    }
  });

  //  queryHash, [start, end            ]
  // Map<string, [date, date | undefined]>
  const queryStorage = new Map(); //use map to track the history of queries
  // post messages to the window
  const queryHasBeenSeen = key => queryStorage.has(key)
  const callback = (event) => {
    // new query (either fresh or after invalidation)
    if (event.type === 'added') {
      // record start time
      queryStorage.set(event.query.queryHash, [Date.now(), ]) //when a query first called, set its queryHash and start time inside map
      // messageWindow({ event, startTime: queryStorage.get(event.query.queryHash)[0], endTime: undefined, type: 'start' } );
    } else if ((event.type === 'updated' && event.action.type === 'success')) { // when fetch call returns and updates cache 
      let startTime, endTime; //initialize start and end time variables
      if(queryHasBeenSeen(event.query.queryHash)){ // check if we've already seen query
        [startTime, endTime] = queryStorage.get(event.query.queryHash); // grab its start and end time and save to startTime & endTime variables
      } else {
        //assuming query was added before script ran, initalize start time to when script loads
        startTime = defaultStart;
      }
      // Query started, but no end time, so we know this update is the end
      if (!endTime) {
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
  queryCache.subscribe(callback) // subscribes the callback to query cache as an observer

  // event added -> record the start time
  // event updated and success -> mark end time. If we marked a start time earlier and no end time, then this is a query
  // If we already marked start and end -> 'cache hit'


  // send from script.js to content.js
  function messageWindow ({ event, startTime, endTime, type }) {
    // console.log('tidied event:\n', 
    //   { ...event, query: { ...event.query, cache: null, observers: null } }
    // );
    //useful information in cache and observer? but we can't include it here because of circular references
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
    }, '*'); // second arg takes in a target origin, which is usually a uri that will be able to receive the message sent as first arg 
  }
}


function getQueryClient () {
  try{
    // iterate through document elements, looking for __vue_app__ prop
    const all = document.querySelectorAll('*');
    let el;
    for (let i = 0; i < all.length; i++) {
      if (all[i].__vue_app__) {
        el = all[i];
        break;
      }
    }
    // try to access Vue query client
    const queryClient = el.__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT;
    return queryClient;
  } catch {
    console.log('Vueable Query Error: Tanstack Query Client not detected');
    return false;
  }
}