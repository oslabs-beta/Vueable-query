import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useQueryStore = defineStore('query', () => {
  // log ref
  // destructure from ref
  // const queryKey = ref(0)
  //ref hook is similar to useState

  const initQuery: Message[] = [];
  const queries = ref(initQuery);

  function addNewQuery(message: Message) {
    // console.log('Message ready to go to Store: ', message);
    queries.value.push(message);
  }

  const startTimeArray = computed(() => {
    return queries.value.map(x => {
      return x.payload.startTime;
    })
  })
  // queries.$patch((state)=>{
  //   state.push({"newQueryKey": "key", "newData": "data"})
  // })

  return { queries, addNewQuery, startTimeArray }
})