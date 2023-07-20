<script setup lang="ts">
import TimelinePanel from './components/TimelinePanel.vue'
import TextPanel from './components/TextPanel.vue'
import { useQueryStore } from './store';
import { ref, onMounted, onUnmounted} from 'vue';

const store = useQueryStore();

const isResizing = ref(false);

const startResize = () => {
  isResizing.value = true;
};

const stopResize = () => {
  isResizing.value = false;
};

const resize = (e:MouseEvent) => {
  if (!isResizing.value) return;
  const mouseY = e.clientY;
  console.log(mouseY)
  store.setTimelinePanelHeight(mouseY - 40);
  e.stopPropagation();

};

onMounted(() => {
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
});

</script>

<template>
  <div v-if="store.pageStartTime > 0" class="container" ref="container">
    <TimelinePanel />
    <div class="resizer" @mousedown="startResize">
    =
    </div>
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

  .resizer{
    background-color: rgb(100, 100, 100);
    color: white;
    text-align: center;
  }


  #timeline-panel, 
  #text-panel {
    overflow: auto;
    padding: 10px;
    min-width: 380px;
    border-style: solid;
  }

  #text-panel{
    flex-grow: 1;
    height: 10px;
  }
</style>
