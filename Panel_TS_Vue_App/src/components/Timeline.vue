<script setup>
import * as d3 from 'd3';
import { ref, onMounted, watch, computed } from 'vue';
import { useQueryStore } from '../store';

const store = useQueryStore();

//margins
const margins = ref({
    top: 25,
    right: 10,
    bottom: 10,
    left: 100
});

const rawWidth = ref(500); // dynamic width and height
const rawHeight = ref(250); // dynamic width and height

const width = computed(() => rawWidth.value - margins.value.left - margins.value.right)
const height = computed(() => rawHeight.value - margins.value.top - margins.value.bottom)

const queryHeight = 20;

const refreshGraph = () => {
    // remove old graph
    d3.selectAll('.query').remove();
    d3.selectAll('.tick').remove();
    d3.selectAll('.domain').remove();
    d3.selectAll('.graph').remove();
    
    // define new graph
    const svg = d3.select('#graph')
        .append('svg')
        .attr('height', rawHeight.value)
        .attr('width', rawWidth.value)
        .classed('graph', true)
        .append('g')
        .attr('transform', `translate(${margins.value.left}, ${margins.value.top})`)
        .classed('graph', true)
        

    const x = d3.scaleLinear()
        .domain([0, store.lastEndTime])
        .range([0, width.value]);

    //y axis
    const y = d3.scaleBand()
        .domain(store.keys)
        .range([0, height.value]);

    svg.append('g')
        .call(d3.axisLeft(y))
        // .attr('transform', `translate(-10, 0)`)


    svg.append('g')
        .call(d3.axisTop(x));

    svg.selectAll('.query')
        .data(store.queries)
        .enter()
        .append('rect')
        .attr('x', function(d) {
            return x(d.startTime);
        })
        .attr('y', function(d) {
            return y(d.queryHash) + y.bandwidth() / 2 - queryHeight / 2;
        })
        .attr('width', function(d) {
            return (x(d.endTime) - x(d.startTime)) || 2;
        })
        .classed('query', true)
        .attr('height', queryHeight)
        .attr('fill', (d) => {
            if (d.originalIndex === store.selection) {
                return 'yellow';
            } else if (d.originalIndex === store.hoverSelection) {
                return 'aqua';
            } else return 'blue';
        })
        .on('mouseover', (e, d) => {
            console.log('mouseover');
            d3.select(this).style("cursor", "pointer");
            store.setHoverSelection(d.originalIndex)
        })
        .on("mouseout", () => {
            console.log('mouseout');
            d3.select(this).style("cursor", "");
            store.setHoverSelection(-1);
        })
        .on("click", (e, d) => {
            console.log('clicked');
            store.setSelection(d.originalIndex);
        })
                

                
        // .on({
        //     "mouseover": (e, d) => {
        //         console.log('mouseover');
        //         store.setHoverSelection(d.originalIndex)},
        //     "mouseout": () => {
        //         console.log('mouseout');
        //         store.setHoverSelection(-1)},
        //     "click": (e, d) => {
        //         console.log('clicked');
        //         store.setSelection(d.originalIndex)}
        // })

        // .on({
        //   "mouseover": function() { /* do stuff */ },
        //   "mouseout":  function() { /* do stuff */ }, 
        //   "click":  function() { /* do stuff */ }, 
        // });
        // change color based on q.originalIndex

    //     @click="store.setSelection(q.originalIndex)"
    // @mouseover="store.setHoverSelection(q.originalIndex)"
    // @mouseleave="store.setHoverSelection(-1)"
    // v-bind:style="q.originalIndex === store.selection ? {backgroundColor :'yellow'} : (q.originalIndex === store.hoverSelection ? {backgroundColor :'aqua'} : {})"        
}

watch(() => store.queries, refreshGraph)
watch(() => store.selection, refreshGraph)
watch(() => store.hoverSelection, refreshGraph)

</script>

<template>
    <div id="graph"></div>
<!-- <svg id="graph" :width="width" :height="height"></svg> -->
</template>

<style scoped>
    rect{
        cursor: pointer;
    }

    .query{
        cursor: pointer;
    }

    
</style>
