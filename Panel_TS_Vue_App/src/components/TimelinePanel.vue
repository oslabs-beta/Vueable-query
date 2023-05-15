<script setup lang="ts">
import { useQueryStore } from '../store';

  const store = useQueryStore();
</script>

<template>
  <div id="timeline-panel">
    <h2>TimeLine: end time is {{  store.lastEndTime }}</h2> 

    <!-- <div
      v-for="(queryList, queryHash) in store.groupedQueries"
      >
      {{ queryHash }}: {{ queryList }}
    </div> -->
    
    <div 
    v-for="q in store.queries"
    :key="q.queryHash"
    @click="store.setSelection(q.originalIndex)"
    @mouseover="store.setHoverSelection(q.originalIndex)"
    @mouseleave="store.setHoverSelection(-1)"
    v-bind:style="q.originalIndex === store.selection ? {backgroundColor :'yellow'} : (q.originalIndex === store.hoverSelection ? {backgroundColor :'aqua'} : {})"        
    class="query-timeline"
    >
      {{ q.queryHash }} {{  q.type }}: Started at {{ q.startTime }}ms
    </div>
  </div>
 
</template>

<style scoped>
  #timeline-panel {
    height: 25rem;
    width: 40rem;
    border-style: solid;
    overflow: scroll;
  }
  .query-timeline:hover {
    cursor: pointer;
    /* background-color: rgba(0, 255, 255, 0.26); */
  }
  .queryBox {
    width: fit-content;
    border-style: solid;
  }
</style>
