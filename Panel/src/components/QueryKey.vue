<script setup lang="ts">
  import { useQueryStore } from '../store';
  import { VueDd } from 'vue-dd';
  import QueryCacheHit from './QueryCacheHit.vue';
  const store = useQueryStore(); 
  const props = defineProps<{
    q: FormattedQuery
  }>()
</script>

<template>
  <div
    @mouseover="store.setHoverSelection(props.q.originalIndex)"
    @mouseleave="store.setHoverSelection(-1)"
    @click="e => {e.stopPropagation(); store.setSelection(props.q.originalIndex)}"
    v-bind:style="props.q.originalIndex === store.selection 
      ? {backgroundColor :'#E4FDE1', color: 'rgb(45, 45, 45)'} 
      : (props.q.originalIndex === store.hoverSelection 
        ? {backgroundColor :'#028090', color: 'white'} 
        : {})"
    class="query-text"  
  >
    <span class="query-info">
      Query for key: 
      <span class="hash">{{ JSON.parse(props.q.queryHash) }}</span> 
      &emsp;
      <vue-dd
        class="text-panel-object"
        :preview="false"
        max-width="35%"
        :dark="false"
        :model-value="q"
      /> 
    </span>
    <br/>
  </div>
  <div >
    <QueryCacheHit
      v-for="c in store.cacheQueries.filter((obj):boolean => obj.queryHash === props.q.queryHash)"
      :key="c.queryHash"
      :c="c"
    />
  </div>
</template>

<style scoped>
  .query-text:hover {
    cursor: pointer;
    /* background-color: rgba(0, 255, 255, 0.25); */
  }

  .query-text {
    display: flex;
    justify-content: left;
    align-items: center;
    vertical-align: center;
  }

  .query-info {
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .hash {
    color: #F45B69;
  }
</style>
