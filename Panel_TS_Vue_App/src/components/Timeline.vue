<script setup>
import * as d3 from 'd3';
import { ref, onMounted, watch } from 'vue';
import { useQueryStore } from '../store';

const store = useQueryStore();

const width = ref(500); // dynamic width and height
const height = ref(250); // dynamic width and height


const refreshGraph = () => {
    console.log('h and w are :', width.value, height.value)
    d3.selectAll('.query').remove();
    d3.selectAll('.tick').remove();
    d3.selectAll('.domain').remove();
    const svg = d3.select('#graph');
    const x = d3.scaleLinear()
        .domain([0, store.lastEndTime])
        .range([0, width.value]);

    const y = d3.scaleBand()
        .domain(store.keys)
        .range([0, height.value]);

    svg.append('g')
        .call(d3.axisLeft(y));

    svg.append('g')
        .call(d3.axisBottom(x));

    svg.selectAll('.query')
        .data(store.queries)
        .enter()
        .append('rect')
        .attr('x', function(d) {
            return x(d.startTime);
        })
        .attr('y', function(d) {
            return y(d.queryHash);
        })
        .attr('width', function(d) {
            return (x(d.endTime) - x(d.startTime)) || 2;
        })
        .classed('query', true)
        .attr('height', 10)
        .attr('fill', 'blue')
}

watch(() => store.queries, refreshGraph)
</script>

<template>
    
    <svg id="graph" :width="width" :height="height"></svg>
</template>