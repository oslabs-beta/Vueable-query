import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Ref } from 'vue'
export const useQueryStore = defineStore('query', () => {
  // log ref
  // destructure from ref
  // const queryKey = ref(0)
  //ref hook is similar to useState

  const data: Ref<Message[]> = ref([]);
  //selection is the index of the query?
  const selection: Ref<number> = ref(-1)
  const hoverSelection: Ref<number> = ref(-1)

  const pageStartTime: Ref<number> = ref(-1);
  const lastEndTime = computed<number>(()=>{
    //in the case that there is no queries yet
    if(data.value.length === 0) return 0;
    console.log('lastEndTime: ', data.value[data.value.length - 1].payload.endTime - pageStartTime.value)
    return data.value[data.value.length - 1].payload.endTime - pageStartTime.value;
  })

  function addPageStartTime(time: number) {
    pageStartTime.value = time;
    console.log('pageStartTime: ', pageStartTime.value)
  }

  function addNewQuery(message: Message) {
    data.value.push(message);
  }

  function setSelection(index: number) {
    selection.value = index;
  }

  function setHoverSelection(index: number) {
    hoverSelection.value = index;
  }

  const queries= computed<FormattedQuery[]>(() => {
    return data.value.map((message, i) => {
      return {
        queryHash: message.payload.event.query.queryHash,
        startTime: message.payload.startTime - pageStartTime.value,
        endTime: message.payload.endTime - pageStartTime.value,
        duration: `${message.payload.endTime -  message.payload.startTime}ms`,
        type: message.payload.type,
        originalIndex: i,
      }
    })
  }) 

  //filter by end
  const endQueries = computed<FormattedQuery[]>(() =>  queries.value.filter((obj) => obj.type === 'end'));
  
  //filter by cache
  const cacheQueries = computed<FormattedQuery[]>(() => queries.value.filter((obj):boolean => (obj.type === 'cache')));

  //filter by start

  return { queries, addNewQuery, endQueries, cacheQueries, setSelection, setHoverSelection, selection, hoverSelection, addPageStartTime, lastEndTime}
})