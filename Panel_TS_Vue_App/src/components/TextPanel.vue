<script setup lang="ts">
  import { useQueryStore } from '../store';
  import { VueDd } from 'vue-dd'
  import { computed } from 'vue'
  const storeQuery = useQueryStore(); 
  console.log('in vue component!')

  const endArray = computed(() =>  storeQuery.textArray.filter((obj) => obj.type === 'end'));
  const cacheArray = computed(() => storeQuery.textArray.filter((obj):boolean => (obj.type === 'cache')));
  

</script>

<template>
  <div id="text-panel">
    <h2>Text</h2>
      <!-- if queryHash matches the queryHash of the last element in the storeQuery.textArray, highlight it -->

    <div
      v-for="(q) in endArray"
      :key="q.queryHash"
      v-bind:style="q.queryHash === storeQuery.textArray[storeQuery.textArray.length-1].queryHash ? {backgroundColor :'yellow'} : {}"
    >
    <span> Query for key: {{ JSON.parse(q.queryHash) }} <br/> </span>
    <vue-dd class="text-panel-object" max-width="80%" :dark="false" :model-value="q" />
      <div
        v-for="q in cacheArray.filter((obj):boolean=> obj.queryHash === q.queryHash)"
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
