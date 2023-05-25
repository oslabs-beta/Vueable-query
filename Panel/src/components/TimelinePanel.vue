<script setup lang="ts">

import { useQueryStore } from '../store';
import TimelineGraph from './TimelineGraph.vue';
const { setSelection } = useQueryStore();
</script>

<template>
  <div
    id="timeline-panel"
    @click="setSelection(-1)"
  >
    <h2>Query Timeline</h2> 
    <TimelineGraph />
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
