<script setup lang="ts">
  import { useQueryStore } from '../store';
  const store = useQueryStore(); 
  const props = defineProps({
    c: FormattedQuery
  })
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
          &emsp; &rarr; Cache hit for key: 
          <span class="hash">{{ JSON.parse(c.queryHash) }}</span>
          at {{ c.startTime }}ms
          <br/>
        </span>
      </div>
</template>

<style scoped>
.cache-info {
    font-size: 16px;
  }
 .hash {
    color: #F45B69;
  }
</style>
