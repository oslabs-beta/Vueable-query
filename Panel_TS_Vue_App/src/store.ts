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
  let selection: Ref<number> = ref(-1)
  let hoverSelection: Ref<number> = ref(-1)

  function addNewQuery(message: Message) {
    console.log('Adding message to store');
    data.value.push(message);
  }

  function setSelection(index: number) {
    console.log('Changing selection to ', index);
    selection.value = index;
  }

  function setHoverSelection(index: number) {
    console.log('Changing hoverSelection to ', index)
    hoverSelection.value = index;
  }

  const queries= computed<FormattedQuery[]>(() => {
    return data.value.map((message, i) => {
      return {
        queryHash: message.payload.event.query.queryHash,
        startTime: message.payload.startTime,
        endTime: message.payload.endTime,
        duration: `${message.payload.endTime -  message.payload.startTime}ms`,
        type: message.payload.type,
        selected: i === selection.value,
        hovered: i === hoverSelection.value,
        originalIndex: i,
      }
    })
  }) 

  //filter by end
  const endQueries = computed<FormattedQuery[]>(() =>  queries.value.filter((obj) => obj.type === 'end'));
  
  //filter by cache
  const cacheQueries = computed<FormattedQuery[]>(() => queries.value.filter((obj):boolean => (obj.type === 'cache')));

  //filter by start

  return { queries, addNewQuery, endQueries, cacheQueries, setSelection, setHoverSelection}
})