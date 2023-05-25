import { useQueryClient, useQuery, QueryObserver } from '@tanstack/vue-query';

const devTool = {
  report: object => {
    console.log("This is our stuff!");
    Object.entries(object)
      .map(([key, value]) => {
        console.log('(our stuff)\n',key, ':', value.value);
      })
  }
}

function vueryDevToolQuery({ queryKey, queryFn }) {
  // console.log('Query for', queryKey)

  //returns the queryClient that all queries go through
  // const queryClient = useQueryClient();
  // const observer = new QueryObserver(queryClient, { queryKey, queryFn, enabled: false});
  // let startTime, endTime;
  // const unsubscribe = observer.subscribe(result => {
  //   console.log('Wrapper function:', queryKey, result)
  //   if (result.status === 'loading') {
  //       startTime = Date.now();
  //   }
  //   if (result.status === 'success') {
  //       unsubscribe();
  //       endTime = Date.now();
  //       if (startTime) console.log('Query retrieved', (endTime - startTime)/1000);
  //       else console.log('Query found in cache')
  //   }
  // })

  
  return useQuery({ queryKey, queryFn });
}

export {
    vueryDevToolQuery as useQuery
}
