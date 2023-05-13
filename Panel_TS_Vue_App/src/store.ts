import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useQueryStore = defineStore('query', () => {
  // log ref
  // destructure from ref
  // const queryKey = ref(0)
  //ref hook is similar to useState

  const initQuery: Message[] = [];
  const queries = ref(initQuery);

  // const current = ref()

  function addNewQuery(message: Message) {
    // console.log('Message ready to go to Store: ', message);
    queries.value.push(message);
    
  }

  // const startTimeArray = computed(() => {
  //   return queries.value.map(x => {
  //     return x.payload.startTime;
  //   })
  // })

  // const queryHashArray = computed(() => {
  //   return queries.value.map(x => {
  //     return x.payload.event.query.queryHash;
  //   })
  // }) 

  // const timeLineArray = computed(() => {
  //   return queries.value.map(message => {
  //     return {
  //       queryHash: message.payload.event.query.queryHash,
  //       startTime: message.payload.startTime,
  //       endTime: message.payload.endTime}
  //     })
  // }) 

  const textArray = computed(() => {
    return queries.value.map(message => {
      return {
        queryHash: message.payload.event.query.queryHash,
        startTime: message.payload.startTime,
        endTime: message.payload.endTime,
        duration: `${message.payload.endTime -  message.payload.startTime}ms`,
        type: message.payload.type
      }
    })
  }) 

  return { queries, addNewQuery, textArray }
})