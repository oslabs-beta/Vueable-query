<script setup lang="ts">
import { useQueryStore } from '../store';

  const storeQuery = useQueryStore();
  
</script>

<template>
  <div id="timeline-panel">
    <h2>TimeLine</h2> 
    <div 
      v-for="(startTime) in storeQuery.startTimeArray"
      :key="startTime"
      className="queryBox"
    >
    {{ startTime }}
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
  .queryBox {
    width: fit-content;
    border-style: solid;
  }
</style>
