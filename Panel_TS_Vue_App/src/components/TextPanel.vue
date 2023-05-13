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
      v-bind:style="q.queryHash === store.queries[store.queries.length-1].queryHash ? {backgroundColor :'yellow'} : {}"
    >
    <span> Query for key: {{ JSON.parse(q.queryHash) }} <br/> </span>
    <vue-dd class="text-panel-object" max-width="80%" :dark="false" :model-value="q" />
      <div
        v-for="q in store.cacheQueries.filter((obj):boolean=> obj.queryHash === q.queryHash)"
        :key="q.queryHash"
      >
        <span>Cache hit for key: {{ JSON.parse(q.queryHash) }} at {{ q.startTime }}<br/><br/></span>
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
/* 
  .text-panel-object {
    
  } */
</style>
