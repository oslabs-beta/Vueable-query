<script setup lang="ts">
import TimelinePanel from './components/TimelinePanel.vue'
import TextPanel from './components/TextPanel.vue'
import { useQueryStore } from './store';
const store = useQueryStore();

</script>

<template>
  <div v-if="store.pageStartTime > 0" class="container">
    <TimelinePanel />
    <TextPanel />
  </div>
  <div id="error" v-else>
    Tanstack Query for Vue not found on current page 😢
  </div>
</template>

<style>
  .container{
    --margin: 10px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 2 * var(--margin));
    width: 100%;
    justify-content: center;
  }

  #timeline-panel, 
  #text-panel {
    height: 50%;
    flex-grow: 1;
    overflow: auto;
    padding: 10px;
    min-width: 380px;
    border-style: solid;
  }
</style>
