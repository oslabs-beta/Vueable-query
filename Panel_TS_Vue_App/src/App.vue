<script setup lang="ts">
import TextPanel from './components/TextPanel.vue'
import TimelinePanel from './components/TimelinePanel.vue'
import { useQueryStore } from './store';
const storeQuery = useQueryStore();
</script>

<template>
  <div>
    <TimelinePanel />
    <TextPanel />
  </div>
</template>

<style scoped>
  #sent-message-test {
    width: 50px;
    height:25px;
  }
</style>
