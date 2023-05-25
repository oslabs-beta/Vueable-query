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
  

    // remove old graph, basically everything besides the div
    d3.selectAll('.query').remove();
    d3.selectAll('.tick').remove();
    d3.selectAll('.domain').remove();
    d3.selectAll('.graph').remove();
    
    // define new graph
    // create svg canvas; add translated point
    // assign translated point to variable 'svg'
    const svg = d3.select('#graph')
        .append('svg')
        .attr('height', rawHeight.value)
        .attr('width', rawWidth.value)
        .classed('graph', true)
        .append('g')
        .attr('transform', `translate(${margins.value.left}, ${margins.value.top})`)
        .classed('graph', true)
        
    // x axis
    const x = d3.scaleLinear()
        .domain([0, store.lastEndTime])
        .range([0, width.value]);
    
    // y axis
    const y = d3.scaleBand()
        .domain(store.keys)
        .range([0, height.value]);

    const yAxis = svg.append('g')
        .call(d3.axisLeft(y))
        // .attr('transform', `translate(-10, 0)`)

    yAxis.selectAll(".tick text")
     .attr("fill","#F45B69")

    svg.append('g')
        .call(d3.axisTop(x));

    svg.selectAll('.query')
        .data(store.queries)
        // entering a data loop, for each query in queries
        .enter()
        .append('rect')
        //lines 71 and 74 tells where the top left corner of each of the bar lives on the svg
        .attr('x', function(d) {
            return x(d.startTime);
        })
        .attr('y', function(d) {
            return y(d.queryHash) + y.bandwidth() / 2 - queryHeight / 2;
        })
        //width of the bar for either a query or cache hit
        .attr('width', function(d) {
            return (x(d.endTime) - x(d.startTime)) || 2;
        })
        //fixed height of bar
        .attr('height', queryHeight)
        // set class to query and id to query{query.originalIndex}
        .classed('query', true)
        .attr("id", function(d){   
                return `query_${d.originalIndex}`;   
        })
        .attr('fill', (d) => {
            if (d.originalIndex === store.selection) {
                return '#E4FDE1';
            } else if (d.originalIndex === store.hoverSelection) {
                return '#028090';
            } else return '#F45B69';
        })
        .on('mouseover', (e, d) => {
            d3.select(this).style("cursor", "pointer");
            store.setHoverSelection(d.originalIndex)
        })
        .on("mouseout", () => {
            d3.select(this).style("cursor", "");
            store.setHoverSelection(-1);
        })
        .on("click", (e, d) => {
            store.setSelection(d.originalIndex);
        })
}

watch(() => store.queries, refreshGraph)
watch(() => store.selection, refreshGraph)
watch(() => store.hoverSelection, refreshGraph)
onMounted(() => {
  refreshGraph();
})

</script>

<template>
    <div id="graph"></div>
</template>

<style scoped>
    rect{
        cursor: pointer;
    }
    .query{
        cursor: pointer;
    }
</style>
