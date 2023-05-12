<script setup lang="ts">
import { useQueryStore } from '../store';
import { VueDd } from 'vue-dd'
  const storeQuery = useQueryStore(); 
  
</script>

<template>
  <div id="text-panel">
    <h2>Text</h2>
    <div
      v-for="q in storeQuery.textArray"
      :key="q.queryHash"
    >
    <vue-dd :model-value="q" />
    </div>
  
  </div>
 
</template>

<style scoped>
  #text-panel {
    height: 25rem;
    width: 40rem;
    border-style: solid
  }
</style>
