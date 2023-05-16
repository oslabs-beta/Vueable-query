<script setup lang="ts">
  import { useQueryStore } from '../store';
  import { VueDd } from 'vue-dd'
  const store = useQueryStore(); 
  console.log('in vue component!')

//  (Map of divs) (establish this after v-for?)
//  watch(store.selection, () => {
//  selecting originalIndex = 12
//    turnOff(Map.get(prevSelection));
//    turnOn(Map.get(store.selection))
// }
</script>

<template>
  <div id="text-panel">
    <h2>Text</h2>
      <!-- if queryHash matches the queryHash of the last element in the storeQuery.textArray, highlight it -->

    <div
      v-for="(q) in store.endQueries"
      :key="q.queryHash"
      >
      <!-- if end query selected, make below div highlighted -->
      <div
      @mouseover="store.setHoverSelection(q.originalIndex)"
      @mouseleave="store.setHoverSelection(-1)"
      @click="store.setSelection(q.originalIndex)"
      v-bind:style="q.originalIndex === store.selection ? {backgroundColor :'yellow'} : (q.originalIndex === store.hoverSelection ? {backgroundColor :'aqua'} : {})"      
      class="query-text"  
      >
        <span> Query for key: {{ JSON.parse(q.queryHash) }} <br/> </span>
        <vue-dd class="text-panel-object" max-width="80%" :dark="false" :model-value="q" />
      </div>
      <!-- if cache query selected, make below div highlighted in the v-for -->
      <div
        v-for="c in store.cacheQueries.filter((obj):boolean=> obj.queryHash === q.queryHash)"
        :key="c.queryHash"
        v-bind:style="c.originalIndex === store.selection ? {backgroundColor :'yellow'} : (c.originalIndex === store.hoverSelection ? {backgroundColor :'aqua'} : {})"        
        @mouseover="store.setHoverSelection(c.originalIndex)"
        @mouseleave="store.setHoverSelection(-1)"
        @click="store.setSelection(c.originalIndex)"
        class="query-text"
      >
        <span>Cache hit for key: {{ JSON.parse(c.queryHash) }} at {{ c.startTime }}ms<br/><br/></span>
      </div>
    </div>

  </div>
 
</template>

<style scoped>
 .query-text:hover {
    cursor: pointer;
    /* background-color: rgba(0, 255, 255, 0.25); */
  }
/* 
  .text-panel-object {
    
  } */
</style>
