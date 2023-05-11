import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useQueryStore = defineStore('query', () => {
  // log ref
  // destructure from ref
  // const queryKey = ref(0)
  //ref hook is similar to useState
  const queries = ref([
    {
      queryKey: '',
      data: {}
    },
  ])
  
  function addNewQuery() {
    console.log('clicked')
    queries.value.push({
      queryKey: 'newKey',
      data: 'newData'
    })
  }
  // queries.$patch((state)=>{
  //   state.push({"newQueryKey": "key", "newData": "data"})
  // })


  return { queries, addNewQuery }
})