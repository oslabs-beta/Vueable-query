<script setup lang="ts">
import { useQueryStore } from '../store';

  const store = useQueryStore();
</script>

<template>
  <div id="timeline-panel">
    <h2>TimeLine</h2> 
    <div 
    v-for="q in store.queries"
    :key="q.queryHash"
    @click="store.setSelection(q.originalIndex)"
    @mouseover="store.setHoverSelection(q.originalIndex)"
    @mouseleave="store.setHoverSelection(-1)"
    v-bind:style="q.selected ? {backgroundColor :'yellow'} : (q.hovered ? {backgroundColor :'aqua'} : {})"
    class="query-timeline"
    >
      {{ q.queryHash }} {{  q.type }}: Started at {{ q.startTime }}
    </div>
  </div>
 
</template>

<style scoped>
  #timeline-panel {
    height: 25rem;
    width: 40rem;
    border-style: solid;
    text-overflow: ellipsis;
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
