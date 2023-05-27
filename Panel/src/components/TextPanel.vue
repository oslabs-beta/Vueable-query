<script setup lang="ts">
  import { useQueryStore } from '../store';
  import QueryKey from './QueryKey.vue';
  const store = useQueryStore(); 
</script>

<template>
  <div @click="store.setSelection(-1)" id="text-panel">
    <!-- if queryHash matches the queryHash of the last element in the storeQuery.textArray, highlight it -->
    <QueryKey
      v-for="(queryHash) in store.keys"
      :key="queryHash" 
      :query-hash="queryHash" 
    />
  </div>
</template>

<style scoped>

  #text-panel {
    background-color: rgb(45, 45, 45);
    color: white;
    padding: 30px;
  } 
  
</style>
