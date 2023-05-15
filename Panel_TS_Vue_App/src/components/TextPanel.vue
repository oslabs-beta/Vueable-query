<script setup lang="ts">
  import { useQueryStore } from '../store';
  import { VueDd } from 'vue-dd'
  const store = useQueryStore(); 
  console.log('in vue component!')
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
      v-bind:style="q.selected ? {backgroundColor :'yellow'} : (q.hovered ? {backgroundColor :'aqua'} : {})"
      >
        <span> Query for key: {{ JSON.parse(q.queryHash) }} <br/> </span>
        <vue-dd class="text-panel-object" max-width="80%" :dark="false" :model-value="q" />
      </div>
      <!-- if cache query selected, make below div highlighted in the v-for -->
      <div
        v-for="c in store.cacheQueries.filter((obj):boolean=> obj.queryHash === q.queryHash)"
        :key="c.queryHash"
        v-bind:style="c.selected ? {backgroundColor :'yellow'} : (c.hovered ? {backgroundColor :'aqua'} : {})"        
        @mouseover="store.setHoverSelection(q.originalIndex)"
        @mouseleave="store.setHoverSelection(-1)"
        @click="store.setSelection(c.originalIndex)"
        class="query-text"
      >
        <span>Cache hit for key: {{ JSON.parse(c.queryHash) }} at {{ c.startTime }}<br/><br/></span>
      </div>
    </div>

  </div>
 
</template>

<style scoped>
  #text-panel {
    height: 25rem;
    width: 40rem;
    border-style: solid;
    overflow: scroll;
  }
  .query-text:hover {
    cursor: pointer;
    /* background-color: rgba(0, 255, 255, 0.25); */
  }
/* 
  .text-panel-object {
    
  } */
</style>
