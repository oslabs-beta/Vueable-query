<script setup lang="ts">
import { useQueryStore } from '../store';

  const queryStore = useQueryStore(); 
</script>

<template>
  <div id="text-panel">
    <h2>Text</h2>
    {{ queryStore.queries }}
  </div>
 
</template>

<style scoped>
  #text-panel {
    height: 25rem;
    width: 40rem;
    border-style: solid
  }
</style>
