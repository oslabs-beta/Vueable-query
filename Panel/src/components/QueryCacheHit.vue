<script setup lang="ts">
  import { useQueryStore } from '../store';
  import { VueDd } from 'vue-dd';
  const store = useQueryStore(); 
  const props = defineProps<{
    c: FormattedQuery
  }>()
</script>

<template>
  <div
    v-bind:style="props.c.originalIndex === store.selection 
      ? {backgroundColor :'#E4FDE1', color: 'rgb(45, 45, 45)'} 
      : (c.originalIndex === store.hoverSelection 
        ? {backgroundColor :'#028090', color: 'white'} 
        : {})"        
    @mouseover="store.setHoverSelection(c.originalIndex)"
    @mouseleave="store.setHoverSelection(-1)"
    @click="e => {e.stopPropagation(); store.setSelection(c.originalIndex)}"
    class="query-text"
  >
    <span class="cache-info">
      &emsp; &rarr; Cache hit at {{ c.startTime }}ms with data:&nbsp;
      <vue-dd
        class="text-panel-object"
        :preview="false"
        :dark="false"
        :model-value="c.data"
      /> 
      <br/>
    </span>
  </div>
</template>

<style scoped>
  .cache-info {
      font-size: 16px;
    }
  .query-text:hover {
    cursor: pointer;
  }
</style>
