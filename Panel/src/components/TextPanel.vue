<script setup lang="ts">
  import { useQueryStore } from '../store';
  import { VueDd } from 'vue-dd';
  const store = useQueryStore(); 
</script>

<template>
  <div @click="store.setSelection(-1)" id="text-panel">
    <!-- if queryHash matches the queryHash of the last element in the storeQuery.textArray, highlight it -->
    <div
      v-for="(q) in store.endQueries"
      :key="q.queryHash"
    >
      <!-- if end query selected, make below div highlighted -->
      <div
        @mouseover="store.setHoverSelection(q.originalIndex)"
        @mouseleave="store.setHoverSelection(-1)"
        @click="e => {e.stopPropagation(); store.setSelection(q.originalIndex)}"
        v-bind:style="q.originalIndex === store.selection 
          ? {backgroundColor :'#E4FDE1', color: 'rgb(45, 45, 45)'} 
          : (q.originalIndex === store.hoverSelection 
            ? {backgroundColor :'#028090', color: 'white'} 
            : {})"
        class="query-text"  
      >
        <span class="query-info">
          Query for key: 
          <span class="hash">{{ JSON.parse(q.queryHash) }}</span> 
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
      <!-- if cache query selected, make below div highlighted in the v-for -->
      <div
        v-for="c in store.cacheQueries.filter((obj):boolean => obj.queryHash === q.queryHash)"
        :key="c.queryHash"
       v-bind:style="c.originalIndex === store.selection 
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
    </div>
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

  #text-panel {
    /* background-color: rgb(248, 248, 248); */
    background-color: rgb(45, 45, 45);
    color: white;
    padding: 30px;
  } 

  .query-info {
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  .cache-info {
    font-size: 16px;
  }

  .hash {
    color: #F45B69;
  }
</style>
