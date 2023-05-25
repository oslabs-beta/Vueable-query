<script setup lang="ts">

import * as d3 from 'd3';
import { ref, watch, computed } from 'vue';
import { useQueryStore } from '../store';

const store = useQueryStore();

//margins
const margins = ref({
  top: 50,
  right: 10,
  bottom: 10,
  left: 100
});

const rawWidth = ref(500); // dynamic width and height
const rawHeight = ref(300); // dynamic width and height 

const width = computed(() => rawWidth.value - margins.value.left - margins.value.right)
const height = computed(() => rawHeight.value - margins.value.top - margins.value.bottom)

const queryHeight = 20;

const refreshGraph = () => {
  // remove old graph, basically everything besides the div
  d3.selectAll('.query').remove();
  d3.selectAll('.tick').remove();
  d3.selectAll('.domain').remove();
  d3.selectAll('.graph').remove();
  d3.selectAll('.tooltip').remove();
  
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
  
  // y axis
  const y = d3.scaleBand()
    .domain(store.keys)
    .range([0, height.value]);

  svg.append('g')
    .call(d3.axisLeft(y))
    //add titles for y-axis
    .append("text")
      .attr("class", "y-title")
      .attr("transform", "rotate(-90)") //rotate y-axis title vertically
      .attr("text-anchor", "end") //signify that this y-axis title will position itself relative to the end of its div
      .attr("y",  (-margins.value.left) / 2 - margins.value.right) //position y-axis title relative to the midpoint of the y-axis
      .attr("x", (-margins.value.left) / 2) //position the y-axis title left of the y-axis labels
      .text("Query Hashes")
      .attr('fill','white')
      .attr('fill','white')
      .attr('font-weight', '700')
      .attr('font-size', '17px')
  // y tick legend -> red
  svg.selectAll(".tick text")
    .attr("fill","#F45B69")

  // x axis
  const x = d3.scaleLinear()
    .domain([0, store.lastEndTime])
    .range([0, width.value]); 
  
  svg.append('g')
      .call(d3.axisTop(x))
    //add titles for x-axis
    .append("text")
      .attr("class", "x-title")
      .attr("text-anchor", "middle") //signify that this x-axis title will position itself relative to the midpoint of its div
      .attr("x", width.value / 2) //position the x-axis title in the middle of the x-axis
      .attr("y", (-margins.value.top / 2) - 5) //position the axis title above the x-axis (negative value to move up)
      .text("Time")
      .attr('fill','white')
      .attr('font-weight', '700')
      .attr('font-size', '17px')

  // add tooltip
  const tooltip = svg.append('g')
    .append('rect')
    .attr('width', 80)
    .attr('height', 70)
    .attr('x', 0) // should initialize to mouse position
    .attr('y', 0) // should initialize to mouse position
    .attr('opacity', 0)
    .style('fill', 'white')
    .style('border-radius', '5px')
    .classed('tooltip', true)

  const tooltipText = tooltip.append('text')
    .text('')

  const toolTipMouseOver = (e, d) => {
    tooltip
      .attr('opacity', 1)
    tooltipText
      .text(d)
  }
  const toolTipMouseOut = e => {
    tooltip
      .attr('opacity', 0)
    tooltipText
      .text('')
  }
  const toolTipMouseMove = e => {
    const padding = 5;
    const distance = 7;
    const [x, y] = d3.pointer(e);
    const xBoundary = width.value;
    const yBoundary = 0;
    const toolWidth = Number(tooltip.attr('width'));
    const toolHeight = Number(tooltip.attr('height'));
    // x reset
    if (x + distance + toolWidth >= xBoundary) {
      tooltip
        .attr('x', xBoundary - toolWidth - padding)
    } else {
      tooltip
        .attr('x', x + distance)
    }
    // y reset
    if (y - distance - toolHeight <= yBoundary) {
      tooltip
        .attr('y', yBoundary + padding)
    } else {
      tooltip
        .attr('y', y - toolHeight - distance)
    }
 } 


  svg.selectAll('.query')
    .data(store.queries)
    // entering a data loop, for each query in queries
    .enter()
    .append('rect')
    //lines 71 and 74 tells where the top left corner of each of the bar lives on the x-axis
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
    .classed('query', true)
    .attr('fill', (d) => {
      if (d.originalIndex === store.selection) {
        return '#E4FDE1';
      } else if (d.originalIndex === store.hoverSelection) {
        return '#028090';
      } else return '#F45B69';
    })
    .on('mouseover', (e, d) => {
      d3.select(this).style("cursor", "pointer");
      store.setHoverSelection(d.originalIndex);
      toolTipMouseOver();
    })
    .on("mouseout", () => {
      d3.select(this).style("cursor", "");
      store.setHoverSelection(-1);
      toolTipMouseOut();
    })
    .on("click", (e, d) => {
      e.stopPropagation();
      store.setSelection(d.originalIndex);
    })
    .on("mousemove", toolTipMouseMove);
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