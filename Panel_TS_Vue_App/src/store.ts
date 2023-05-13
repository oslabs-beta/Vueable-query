import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useQueryStore = defineStore('query', () => {
  // log ref
  // destructure from ref
  // const queryKey = ref(0)
  //ref hook is similar to useState

  const initQuery: Message[] = [];
  const data = ref(initQuery);

  function addNewQuery(message: Message) {
    // console.log('Adding message to store: ', message);
    data.value.push(message);
  }

  const queries = computed(() => {
    return data.value.map(message => {
      return {
        queryHash: message.payload.event.query.queryHash,
        startTime: message.payload.startTime,
        endTime: message.payload.endTime,
        duration: `${message.payload.endTime -  message.payload.startTime}ms`,
        type: message.payload.type
      }
    })
  }) 

  //filter by end
  const endQueries = computed(() =>  queries.value.filter((obj) => obj.type === 'end'));
  
  //filter by cache
  const cacheQueries = computed(() => queries.value.filter((obj):boolean => (obj.type === 'cache')));

  //filter by start

  return { queries, addNewQuery, endQueries, cacheQueries}
})