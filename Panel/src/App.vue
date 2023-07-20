<script setup lang="ts">
import TimelinePanel from './components/TimelinePanel.vue'
import TextPanel from './components/TextPanel.vue'
import { useQueryStore } from './store';
import { ref, onMounted, onUnmounted} from 'vue';

const store = useQueryStore();

const container = ref<HTMLDivElement | null>(null)
const topHeight = ref(500)
const bottomHeight = ref(500)
const isResizing = ref(false);

const startResize = () => {
  isResizing.value = true;
};

const stopResize = () => {
  isResizing.value = false;
};

const resize = (e:MouseEvent) => {
  if (!isResizing.value) return;

  const containerHeight = container.value?.clientHeight || 0;
  const mouseY = e.clientY;
  topHeight.value = mouseY;
  bottomHeight.value = containerHeight - mouseY - 8; // Subtract 8px for the height of the resize handle
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
    <div class="top" :style="{ height: topHeight + 'px' }">
      <TimelinePanel />
    </div>
    <div class="resizer" :style="{ height: '8px' }" @mousedown="startResize">

    </div>
    <div class="bottom" :style="{ height: bottomHeight + 'px' }">
      <TextPanel />
    </div>
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
    background-color: aqua;
  }

  .top, .bottom {
    overflow:auto;
    flex-grow: 1;
  }

  #timeline-panel, 
  #text-panel {
    flex-grow: 1;
    overflow: auto;
    padding: 10px;
    min-width: 380px;
    border-style: solid;
  }
</style>
