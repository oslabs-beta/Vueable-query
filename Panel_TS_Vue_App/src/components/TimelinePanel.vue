<script setup lang="ts">
import { useQueryStore } from '../store';
import Timeline from './Timeline.vue';
  const store = useQueryStore();
</script>

<template>
  <div id="timeline-panel">
    <h2>Query Timeline</h2> 

    <!-- <div
      v-for="(queryList, queryHash) in store.groupedQueries"
      >
      {{ queryHash }}: {{ queryList }}
    </div> -->
    
    <Timeline />
    <!-- <div 
    v-for="q in store.queries"
    :key="q.queryHash"
    @click="store.setSelection(q.originalIndex)"
    @mouseover="store.setHoverSelection(q.originalIndex)"
    @mouseleave="store.setHoverSelection(-1)"
    v-bind:style="q.originalIndex === store.selection ? {backgroundColor :'yellow'} : (q.originalIndex === store.hoverSelection ? {backgroundColor :'aqua'} : {})"        
    class="query-timeline"
    >
      {{ q.queryHash }} {{  q.type }}: Started at {{ q.startTime }}ms
    </div> -->
  </div>
 
</template>

<style scoped>
  #timeline-panel {
    background-color: rgb(45, 45, 45);
    color: white;
  }
  .queryBox {
    width: fit-content;
    border-style: solid;
  }

  h2 {
    font-family: 'Cormorant Garamond', serif;
    text-align: center;
    font-weight: 700;
    font-size: 20px;
  }
</style>