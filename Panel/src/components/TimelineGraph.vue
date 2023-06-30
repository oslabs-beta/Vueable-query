<script setup lang="ts">
import * as d3 from 'd3';
import { ref, watch, computed, onMounted} from 'vue';
import { useQueryStore } from '../store';

const store = useQueryStore();
//set a threshold of y-axis ticks before triggering a yaxis rerender
const maxCount = 10;
//set height of data points on graph
const queryHeight = 20;
//set vertical padding between data points
const innerPaddingHeight = 20;
//calculate baseHeight to determine range of yaxis before crossing threshold 
const baseHeight = maxCount * queryHeight + (maxCount - 1) * innerPaddingHeight;
//calulate inner padding ratio for scale bands before crossing threshold
const baseInnerRatio = ((maxCount - 1) * innerPaddingHeight) / ((maxCount - 1) * innerPaddingHeight + (maxCount * queryHeight)); 
//set constant outer padding ratio for scale bands before crossing threshold
const baseOuterRatio = 0.4;
//set radius of circle
const circleRadius = 3.5;
//margins
const margins = ref({
    top: 50,
    right: 20, 
    bottom: 10,
    left: 105 
});

// dynamic svg width
const rawWidth = ref(Math.max(window.innerWidth - 80, 350)); 
//dynamic svg height
const rawHeight = computed(() => baseHeight + margins.value.top - margins.value.bottom) 
//calculate width of timeline graph
const width = computed(() => rawWidth.value - margins.value.left - margins.value.right)

//calculate computed padding inner value
const paddingInner = computed(() => {
    if (store.keys.length <= maxCount) {
        return baseInnerRatio; 
    } else {
        return (store.keys.length - 1) * innerPaddingHeight / ((store.keys.length - 1) * innerPaddingHeight + (store.keys.length * queryHeight));
    }
})
//calculate computed padding outer value
const paddingOuter = computed(() => {
    if (store.keys.length < maxCount) {
        return baseOuterRatio;
    } else {
        const spacesOnGraph = ((store.keys.length - 1) * innerPaddingHeight) + (queryHeight * store.keys.length)
        return spacesOnGraph / (spacesOnGraph + ((width.value - store.keys.length) / 2))
        // return baseOuterRatio;
    }
}) 

//calculate computed additional y-axis length after crossing threshold  
const yAxisAddition = computed(() => { 
    if (store.keys.length > maxCount) {
        const diff = store.keys.length - maxCount;
        return diff * (innerPaddingHeight + queryHeight);
    }
    else return 0;
})

const selectionState: {
  selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  hoverSelection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
} = {
  selection: d3.select('window'),
  hoverSelection: d3.select('window'),
};

const refreshGraph = (): void => {
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
    .on("mousemove", toolTipMouseMove)
    .append('g')
    .attr('transform', `translate(${margins.value.left}, ${margins.value.top})`)
    .classed('graph', true)
    
    // y axis
    const y = d3.scaleBand()
        .domain(store.keys)
        .range([0, baseHeight + yAxisAddition.value])
        .paddingInner(paddingInner.value)
        .paddingOuter(paddingOuter.value)

    svg.append('g')
        .call(d3.axisLeft(y).tickFormat((x) => {
            //create a var that is the cutoff point for y-axis labels
            const maxLength = 11; 
            if(x.length <= maxLength) { //check if query hash is less than 10 char
                return x; //display query hash as is
            } else {
                return x.slice(0, maxLength - 2) + '...'; //truncate label
            }
        }))
        .append("text")
            .attr("class", "y-title")
            .attr("transform", "rotate(-90)") //rotate y-axis title vertically
            .attr("text-anchor", "middle") //signify that this y-axis title will position itself relative to the end of its div
            .attr("x",  -(baseHeight / 2) - yAxisAddition.value / 2) //position y-axis title relative to the midpoint of the y-axis
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
                return `${hour}h:${(x.valueOf()-(hour * 3_600_000) / 1_000 / 60).toPrecision(1)}m`
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
    const shapes = svg
      .selectAll('.shapes')
      .data(store.queries)
      .enter()
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
        .on('mouseover', (e, d) => {
            d3.select(e.target).style("cursor", "pointer");
            store.setHoverSelection(d.originalIndex)
            toolTipMouseOver(e, d);
        })
        .on("mouseout", (e) => {
            d3.select(e.target).style("cursor", "");
            store.setHoverSelection(-1);
            toolTipMouseOut();
        })
        .on("click", (e, d) => {
            e.stopPropagation();
            store.setSelection(d.originalIndex);
        })
    //circle
    shapes.append("circle")
        //only add circles if rect shrink to at least 2px
        .filter(function(d) {
            return (x(d.endTime) - x(d.startTime) <= 2);
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
            if(d.startTime === d.endTime) {
              // @ts-ignore d.queryHash is always defined
              return y(d.queryHash) + y.bandwidth() / 2 + queryHeight / 2 + circleRadius;
            }
            // @ts-ignore d.queryHash is always defined
            return y(d.queryHash) + y.bandwidth() / 2 - queryHeight / 2 - circleRadius;
        })
        .attr('r', circleRadius)
        //fixed height of bar
        .attr('height', queryHeight)
        .classed('query', true)
        .on('mouseover', (e, d) => {
            d3.select(e.target).style("cursor", "pointer");
            store.setHoverSelection(d.originalIndex)
            toolTipMouseOver(e, d);
        })
        .on("mouseout", (e) => {
            d3.select(e.target).style("cursor", "");
            store.setHoverSelection(-1);
            toolTipMouseOut();
        })
        .on("click", (e, d) => {
            e.stopPropagation();
            store.setSelection(d.originalIndex);
        })

  // add tooltip
  const padding = 5;
  const ttWidth = 100;
  const ttHeight = 100;

  const tooltip = svg.append('g')
    .classed('tooltip', true)

  /* foreignObject suggestion taken from */
  /* https://stackoverflow.com/questions/24784302/wrapping-text-in-d3 */
  const tooltipTextRoot = tooltip.append('foreignObject')
    .style('width', ttWidth)
    .style('height', ttHeight)
    .attr('x', 0) // should initialize to mouse position
    .attr('y', 0) // should initialize to mouse position
    .classed('tooltip text', true)
  const tooltipText = tooltipTextRoot
    .append('xhtml:div')
    .style('display', 'flex')
    .style('visibility', 'hidden')
    .style('text-align', 'center')
    .style('padding', `${padding}px`)
    .style('font-size', '12px')
    .style('overflow-y', 'auto')
    .style('color', 'black')
    .style('background-color', 'white')
    .style('border-radius', '5px')
    .style('box-sizing', 'border-box')
    .html('')

  function toolTipMouseOver (_: Event, d: FormattedQuery) {
    const prettyText = (d: FormattedQuery) => (
      `<p style="text-align: left">
        ${d.queryHash}</br>
        dur: ${d.duration}</br>
        type: ${d.type}
      </p>`
    );
    tooltipText
      .style('visibility', 'visible')
      .html(prettyText(d))
  }
  function toolTipMouseOut () {
    tooltipText
      .style('visibility', 'hidden')
      .html('')
  }
  function toolTipMouseMove (e: Event) {
    const distance = 7;
    let [x, y] = d3.pointer(e);
    x = x - margins.value.left;
    y = y - margins.value.top;
    const xBoundary = width.value;
    const yBoundary = 0;
    // x reset
    if (x + distance + ttWidth >= xBoundary) {
      tooltipTextRoot.attr('x', x- ttWidth - padding - distance);
    } else {
      tooltipTextRoot.attr('x', x + distance);
    }
    // y reset
    if (y - distance - ttHeight <= yBoundary) {
      tooltipTextRoot.attr('y', y + padding + distance);
    } else {
      tooltipTextRoot.attr('y', y - ttHeight - distance);
    }
  } 
}

watch(() => store.queries, refreshGraph)
watch(() => store.selection, () => {
  // turn off previous selection
  selectionState.selection
    .classed('selected', false)
// get current selection and reset color
   const selection = d3.selectAll('.query')
     //TODO  fix typing
     .filter((d:any) => d.originalIndex === store.selection)
    .classed('selected', true)
  selectionState.selection = selection;
})
watch(() => store.hoverSelection, () => {
  // turn off old selection
  selectionState.hoverSelection
    .classed('hover', false);
  // get current selection and reset color
  const hoverSelection = d3.selectAll('.query')
    //TODO  fix typing
    .filter((d:any) => d.originalIndex === store.hoverSelection)
    .classed('hover', true);
 selectionState.hoverSelection = hoverSelection;
})

// Renders graph on mount
onMounted(() => refreshGraph())
// Resizes graph on window resize
const handleResize = () => {
  rawWidth.value = Math.max(window.innerWidth - 80, 350)
  refreshGraph()
}
onMounted(() => window.addEventListener('resize', handleResize))
</script>

<template>
  <div id="graph"></div>
</template>

<style lang="scss">
.query {
  fill: #f45b69;
}
.query.selected.selected {
  fill: #E4FDE1;
}
.query.hover {
  fill: #028090;
}
</style>
