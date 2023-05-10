console.log('hello world!')
const queryClient = document.getElementById('app').__vue_app__._context.app._context.provides.VUE_QUERY_CLIENT
const queryCache = queryClient.getQueryCache()
let startTime, endTime;
const callback = (event) => {
  if(event.type === 'added'){
    startTime = Date.now();
    console.log('API Query Started for', event.query.queryKey)
  }
  else if((event.type === 'updated' && event.action.type === 'success')){
    if(startTime){
      endTime = Date.now();
      console.log('API Query Finished in', (endTime - startTime) / 1000 , 's for' , event.query.queryKey)
      startTime = undefined;
    } else {
      console.log('Cache hit for' , event.query.queryKey)
      //console.log(event)
    }
  } 
  //console.log(event.type, event.query.observers[0]?.currentResult.status)
}
const unsubscribe = queryCache.subscribe(callback)