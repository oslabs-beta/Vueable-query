<script setup lang="ts">
import { useQueryStore } from '../store';
import Timeline from './Timeline.vue';
</script>

<template>
  <div id="timeline-panel">
    <h2>Query Timeline</h2> 
    <Timeline />
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