<script setup lang="ts">
  import { useQueryStore } from '../store';
  import { VueDd } from 'vue-dd';
  const store = useQueryStore(); 
  defineProps<{
    c: FormattedQuery
  }>()
</script>

<template>
  <div
    @mouseover="store.setHoverSelection(c.originalIndex)"
    @mouseleave="store.setHoverSelection(-1)"
    @click="e => {e.stopPropagation(); store.setSelection(c.originalIndex)}"
    v-bind:style="c.originalIndex === store.selection 
      ? {backgroundColor :'#E4FDE1', color: 'rgb(45, 45, 45)'} 
      : (c.originalIndex === store.hoverSelection 
        ? {backgroundColor :'#028090', color: 'white'} 
        : {})"
    class="query-text"  
  >
    <span class="cache-info">
      &emsp; &rarr; Fetched from {{ c.startTime }}ms to {{ c.endTime }}ms with data:&nbsp;
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

.query-text:hover {
    cursor: pointer;
  }
.cache-info {
    font-size: 16px;
  }

</style>