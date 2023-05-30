<script setup lang="ts">

import * as d3 from 'd3';
import { ref, watch, computed } from 'vue';
import { useQueryStore } from '../store';

const store = useQueryStore();

//margins
const margins = ref({
    top: 50,
    right: 20, 
    bottom: 10,
    left: 105 
});

const rawWidth = ref(550); // dynamic width and height
const rawHeight = ref(200); // dynamic width and height 

const paddingInner = ref(0.9)
const paddingOuter = ref(0.3)


const addPaddingInner = computed(() => {
    if(store.keys.length > 3) {
        const diff = store.keys.length - 3;
        return  paddingInner.value * diff
    }
    return paddingInner.value
})

const addPaddingOuter = computed(() => {
    if(store.keys.length > 3) {
        // const diff = store.keys.length - 3;
        return  paddingOuter.value * 3
    }
    return paddingOuter.value
})

const width = computed(() => rawWidth.value - margins.value.left - margins.value.right)
const height = computed(() => rawHeight.value - margins.value.top - margins.value.bottom)

//computed value to watch the query Hashes
    //if it changes, check if the different of the (13) - 11(threshold) and account to add more length
const yAxisRescale = computed(() => { 
    if(store.keys.length > 3) {
        const diff = store.keys.length - 3;
        return 20 * diff;
    }
    return 0;
})

const queryHeight = 20;

const refreshGraph = (): void => {
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
        .attr('height', rawHeight.value + yAxisRescale.value)
        .attr('width', rawWidth.value)
        .classed('graph', true)
        .append('g')
        .attr('transform', `translate(${margins.value.left}, ${margins.value.top})`)
        .classed('graph', true)

    
    // y axis
    const y = d3.scaleBand()
        .domain(store.keys)
        .range([0, height.value + yAxisRescale.value])
        .paddingInner(addPaddingInner.value)
        .paddingOuter(addPaddingOuter.value)

    svg.append('g')
        .call(d3.axisLeft(y).tickFormat((x) => {
            //create a var that is the cutoff point for y-axis labels
                //can decide to change later
            const maxLength = 10; 
            if(x.length <= maxLength) { //check if query hash is less than 10 char
                return x; //display query hash as is
            } else {
                return x.slice(0, maxLength) + '...';
            }
        }))
        .append("text")
            .attr("class", "y-title")
            .attr("transform", "rotate(-90)") //rotate y-axis title vertically
            .attr("text-anchor", "middle") //signify that this y-axis title will position itself relative to the end of its div
            .attr("x",  -(height.value / 2) - yAxisRescale.value / 2) //position y-axis title relative to the midpoint of the y-axis
            .attr("y", -70) //position the y-axis title left of the y-axis labels
            .text("Query Hashes")
            .attr('fill','white')
            .attr('fill','white')
            .attr('font-weight', '700')
            .attr('font-size', '17px')

    svg.selectAll(".tick text")
     .attr("fill","#F45B69")

    // x axis
    const x = d3.scaleLinear()
        .domain([0, store.lastEndTime])
        .range([0, width.value])
    
    svg.append('g')
        //dynamically rescale x-axis tick labels
        .call(d3.axisTop(x).ticks(8).tickFormat((x) => {
            let second = x.valueOf() / 1_000
            let minute = Math.floor(second / 60);
            let hour = Math.floor(minute / 60);
            //check if ms is over an hour
            if(x.valueOf() >= 3.6e+6) {
                const milliSecond = x.valueOf()-(hour * 3_600_000);
                return `${hour}h:${(milliSecond.valueOf() / 1_000 / 60).toPrecision(1)}m` //convert ms to hr and round to 2 sig figs
            }
            //check if current time in ms is greater than a minute
            else if(x.valueOf() >= 60_000) { 
                return `${minute}m${(x.valueOf() - (minute * 60_000)) / 1_000}s` 
            } 
            //check if ms is greater than a second
            else if (x.valueOf() >= 1_000){ 
                return `${second.toPrecision(2)}s` //convert ms to seconds
            } 
            else if( x.valueOf() < 0) {
                return '';
            }
            else {
                return `${x}ms` //keep time as ms
            }
        }))
        //add titles for x-axis
        //axis title arent built in so we need to manual add a 'text' element ourselves
        .append("text")
            .attr("class", "x-title")
            .attr("text-anchor", "middle") //signify that this x-axis title will position itself relative to the midpoint of its div
            .attr("x", width.value/2) //position the x-axis title in the middle of the x-axis
            .attr("y", -margins.value.top / 2 - 5) //position the axis title above the x-axis (negative value to move up)
            .text("Time")
            .attr('fill','white')
            .attr('font-weight', '700')
            .attr('font-size', '17px')

    //create a shapes variable
    const shapes = svg.selectAll(".shapes").data(store.queries).enter()
    //render rectangle for query/cache hits
    shapes.append("rect")
        .attr('x', function(d) {
            //places rectangle on endTime
            return x(d.startTime);
        })
        .attr('y', function(d) {
            // @ts-ignore d.queryHash is always defined
            return y(d.queryHash) + y.bandwidth() / 2 - queryHeight / 2;
        })
        //width of the bar for either a query or cache hit
        .attr('width', function(d) {
            return (x(d.endTime) - x(d.startTime)) || 1;
            // return 2 //fixed width
        })
        //fixed height of bar
        .attr('height', queryHeight)
        .classed('query', true)
        .attr('fill', (d) => {
            if (d.originalIndex === store.selection) {
                return '#E4FDE1';
            } else if (d.originalIndex === store.hoverSelection) {
                return '#028090';
            } else return '#F45B69';
        })
        .on('mouseover', (e, d) => {
            d3.select(e.target).style("cursor", "pointer");
            store.setHoverSelection(d.originalIndex)
        })
        .on("mouseout", (e, d) => {
            d3.select(e.target).style("cursor", "");
            store.setHoverSelection(-1);
        })
        .on("click", (e, d) => {
            e.stopPropagation();
            store.setSelection(d.originalIndex);
        })
    //circle
    shapes.append("circle")
        //only add circles if rect shrink to at least 2px
        .filter(function(d) {
            return (x(d.endTime) - x(d.startTime)) <= 2;
        })
        .attr('cx', function(d) {
            //create var to hold the pixel width of the rect
            const widthPX = (x(d.endTime) - x(d.startTime))
            //if pixel is between length of 1 to 2 px
                //subtract 0.5px to align circle ontop rect
            if ((widthPX > 1)) {
                return x(d.endTime) - 0.5; 
            }
            //defaults circle to align ontop rect that is 1px or less
            return x(d.endTime);
        })
        .attr('cy', function(d) {
            // @ts-ignore d.queryHash is always defined
            return y(d.queryHash) + y.bandwidth() / 2 - queryHeight / 2 - 2 ;
        })
        .attr('r', 3.5)
        //fixed height of bar
        .attr('height', queryHeight)
        .classed('query', true)
        .attr('fill', (d) => {
            if (d.originalIndex === store.selection) {
                return '#E4FDE1';
            } else if (d.originalIndex === store.hoverSelection) {
                return '#028090';
            } else return '#F45B69';
        })
        .on('mouseover', (e, d) => {
            d3.select(e.target).style("cursor", "pointer");
            store.setHoverSelection(d.originalIndex)
        })
        .on("mouseout", (e, d) => {
            d3.select(e.target).style("cursor", "");
            store.setHoverSelection(-1);
        })
        .on("click", (e, d) => {
            e.stopPropagation();
            store.setSelection(d.originalIndex);
        })
}

watch(() => store.queries, refreshGraph)
watch(() => store.selection, refreshGraph)
watch(() => store.hoverSelection, refreshGraph)

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
