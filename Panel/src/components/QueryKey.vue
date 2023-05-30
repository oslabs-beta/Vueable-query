<script setup lang="ts">
  import { useQueryStore } from '../store';
  import QueryCacheHit from './QueryCacheHit.vue';
  import QueryEnd from './QueryEnd.vue';
  const store = useQueryStore(); 
  const props = defineProps<{
    queryHash: string
  }>()
</script>

<template>
  <span class="query-info">
      Query for key: 
      <span class="hash">{{ queryHash }}</span> 
  </span>
  <div>
    <QueryEnd
      v-for="c in store.endQueries.filter((obj):boolean => obj.queryHash === props.queryHash)"
      :key="c.queryHash"  
      :c="c" 
  />
  </div>
  <div >
    <QueryCacheHit
      v-for="c in store.cacheQueries.filter((obj):boolean => obj.queryHash === props.queryHash)"
      :key="c.queryHash"
      :c="c"
    />
  </div>
</template>

<style scoped>
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
