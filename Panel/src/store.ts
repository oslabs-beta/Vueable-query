import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
export const useQueryStore = defineStore('query', () => {

  // ---definitions---
  const data: Ref<Message[]> = ref([]);
  // selection is the index of the query array
  const selection: Ref<number> = ref(-1);
  const hoverSelection: Ref<number> = ref(-1);
  //when script first loads up
  const pageStartTime: Ref<number> = ref(-1); 
  //height of the timeline panel in px, text panel flex-grows the remaining space
  const timelinePanelHeight: Ref<number> = ref(500);

  // ---setters---
  // setters can't be arrow functions
  function setPageStartTime(time: number): void {
    // reset the history when we get a new start time
    resetHistory();
    pageStartTime.value = time;
    // console.log('pageStartTime: ', pageStartTime.value)
  }

  function addNewQuery(message: Message): void {
    data.value.push(message);
  }

  function resetHistory(): void {
    data.value = [];
    pageStartTime.value = -1;
    selection.value = -1;
    hoverSelection.value = -1;
  }

  function setSelection(index: number): void {
    selection.value = index;
    console.log(selection.value)
  }

  function setTimelinePanelHeight(height: number): void{
    timelinePanelHeight.value = height
  }

  function setHoverSelection(index: number): void {
    hoverSelection.value = index;
  }

  // ---getters for computed values---
  const lastEndTime = computed<number>(() => {
    //in the case that there are no queries
    if(data.value.length === 0) return 0;
    // console.log('lastEndTime: ', data.value[data.value.length - 1].payload.endTime - pageStartTime.value)
    // return as relative endTime (since the page started)
    return data.value[data.value.length - 1].payload.endTime - pageStartTime.value;
  })

  const queries = computed<FormattedQuery[]>(() => {
    return data.value.map((message, i) => {
      // standardize queries
      return {
        queryHash: message.payload.event.query.queryHash,
        startTime: message.payload.startTime - pageStartTime.value,
        endTime: message.payload.endTime - pageStartTime.value,
        duration: `${message.payload.endTime -  message.payload.startTime}ms`,
        type: message.payload.type,
        originalIndex: i,
        data: message.payload.event.query.state.data,
      }
    })
  }) 

  // //group by Query Hash
  // //indexable type [queryHash: string] means that any key of result must be a string
  // //queryHash in this case only describes the string, but does not show up in the final object
  // const groupedQueries = computed<{[queryHash: string]: FormattedQuery[]}>(() => {
  //   //group the queries array by queryHash
  //   const result: {[queryHash: string]: FormattedQuery[]} = {};
  //   queries.value.forEach((q) => { 
  //     //if queryHash is not in result, initialize an empty array
  //     if(!result.hasOwnProperty(q.queryHash)) {
  //       result[q.queryHash] = [];
  //     }
  //     result[q.queryHash].push(q);
  //   })
  //   return result;
  // })

  const keys = computed<string[]>(() => {
    // list every unique key for timeline y axis
    const result: string[] = [];
    queries.value.forEach((q) => { 
      //if queryHash is not in result, initialize an empty array
      if(!result.includes(q.queryHash)) {
        result.push(q.queryHash)
      }
    })
    return result;
  })
  
  // filter by type: end 
  const endQueries = computed<FormattedQuery[]>(() =>  queries.value.filter((obj) => obj.type === 'end'));
  
  // filter by type: cache
  const cacheQueries = computed<FormattedQuery[]>(() => queries.value.filter((obj):boolean => (obj.type === 'cache')));


  return {data, keys, queries, addNewQuery, resetHistory, endQueries, cacheQueries, setSelection, setHoverSelection,
    pageStartTime, selection, hoverSelection, setPageStartTime,lastEndTime, timelinePanelHeight, setTimelinePanelHeight }
})