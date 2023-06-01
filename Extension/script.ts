// script.ts is the injected script that detects if the page is running Tanstack Query for Vue
// if found, it attaches a listener to the querycache and sends messages to content.js

if(!(Object.prototype.hasOwnProperty.call(window, '__VUE__'))){ // check if Vue is running
  console.log('Vueable Query Error: Vue app not detected');
} else if(getQueryClient()) { // check if Tanstack Query is running
  console.log('Vueable Query: Tanstack Query client found');

  const queryClient = getQueryClient();
  const queryCache = queryClient.getQueryCache(); // central cache that we attach observer to 
  const defaultStart = Date.now(); //once script loads, set a default start time
  //send message with the default start time
  window.postMessage({ // post message to window that the webpage is on (chrome window)
    source: 'vueable-query-extension', // our extension
    payload: {
      startTime: defaultStart,
      type: 'pageStartTime' 
    }
  });
  //event.type, event.action?.type, event.query.isStale());
  //start is updated fetch true
  // end is updated success true
  // cache hit is oberverresultsupdated false -> observer added

  //  queryHash, [start, end            ]
  // Map<string, [date, date | undefined]>
  const queryStorage = new Map<string, number>(); //use map to track the start Time
  let queryUpdateForCache = false;
  // post messages to the window
  const callback = (event: Event) => {
    // new query (either fresh or after invalidation)
    console.log(event.query.queryHash, event.type, event.action?.type, event.query.isStale());

    //for fetch requests
    if (event.type === 'updated' && event.action?.type === 'fetch') {
      // record start time
      queryStorage.set(event.query.queryHash, Date.now()) //when a query first called, set its queryHash and start time inside map
      // messageWindow({ event, startTime: queryStorage.get(event.query.queryHash)[0], endTime: undefined, type: 'start' } );
    } else if ((event.type === 'updated' && event.action.type === 'success')) { // when fetch call returns and updates cache 
      const startTime = queryStorage.has(event.query.queryHash) ? queryStorage.get(event.query.queryHash)! : defaultStart
      const endTime = Date.now();
      messageWindow({ event, startTime, endTime, type: 'end' });
    } 
      
    // keep track of cache hits
      //event.type, event.action?.type, event.query.isStale());
  //start is updated fetch true
  // end is updated success true
  // cache hit is oberverresultsupdated false -> observer added
    if(queryUpdateForCache && event.type === 'observerAdded'){
      const time = Date.now();
      messageWindow({ event, startTime: time, endTime:time, type: 'cache' });
    }
    queryUpdateForCache = (event.type === 'observerResultsUpdated' && event.query.isStale() === false);

  }  //callback 
  queryCache.subscribe(callback) // subscribes the callback to query cache as an observer
}


function getQueryClient () {
  try{
    // iterate through document elements, looking for __vue_app__ prop
    const all = document.querySelectorAll('*');
    let el;
    for (let i = 0; i < all.length; i++) {
      if (Object.prototype.hasOwnProperty.call(all[i], '__vue_app__')) {
        el = all[i];
        break;
      }
    }
    // try to access Vue query client
    // @ts-ignore we check if __vue_app__ exists above
    const queryClient = el.__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT;
    return queryClient;
  } catch {
    console.log('Vueable Query Error: Tanstack Query Client not detected');
    return false;
  }
}

function messageWindow ({ event, startTime, endTime, type }: 
  {event: Event, startTime: number, endTime: number, type: string}) {
  // console.log('tidied event:\n', 
  //   { ...event, query: { ...event.query, cache: null, observers: null } }
  // );
  //useful information in cache and observer? but we can't include it here because of circular references
  //can send event.action.data if it exists
  window.postMessage({
    source: 'vueable-query-extension',
    payload: {
      startTime,
      endTime,
      type,
      //json parse and json stringify necessary because of error, cant send messages. Also remove circular references
      //https://stackoverflow.com/questions/42376464/uncaught-domexception-failed-to-execute-postmessage-on-window-an-object-co
      event: JSON.parse(JSON.stringify({query: { ...event.query, cache: null, observers: null }}))
    }
  }, '*'); // second arg takes in a target origin, which is usually a uri that will be able to receive the message sent as first arg 
}