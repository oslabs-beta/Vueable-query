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
    @mouseover="store.setHoverSelection(props.c.originalIndex)"
    @mouseleave="store.setHoverSelection(-1)"
    @click="e => {e.stopPropagation(); store.setSelection(props.c.originalIndex)}"
    v-bind:style="props.c.originalIndex === store.selection 
      ? {backgroundColor :'#E4FDE1', color: 'rgb(45, 45, 45)'} 
      : (props.c.originalIndex === store.hoverSelection 
        ? {backgroundColor :'#028090', color: 'white'} 
        : {})"
    class="query-text"  
  >
    <span class="cache-info">
      &emsp; &rarr; Fetch Query at:
      <span class="hash">{{ JSON.parse(props.c.queryHash) }}</span>
      at {{ props.c.startTime }}ms
      &emsp;
      <vue-dd
        class="text-panel-object"
        :preview="false"
        max-width="35%"
        :dark="false"
        :model-value="c"
      /> 
    </span>
    <br/>
  </div>
</template>

<style scoped>

.query-text:hover {
    cursor: pointer;
  }
.query-text {
  display: flex;
  justify-content: left;
  align-items: center;
  vertical-align: center;
}
.cache-info {
    font-size: 16px;
  }
.hash {
    color: #F45B69;
  }
</style>