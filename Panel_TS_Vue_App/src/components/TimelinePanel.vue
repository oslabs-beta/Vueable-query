<script setup lang="ts">
import { useQueryStore } from '../store';
import Timeline from './Timeline.vue';
  const store = useQueryStore();

</script>

<template>
  <div id="timeline-panel">
    <h2>TimeLine</h2> 
    <div>
      <Timeline />
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
