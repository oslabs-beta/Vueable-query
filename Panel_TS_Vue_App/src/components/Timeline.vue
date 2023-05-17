<template>
    <svg id="graph" width="250" height="500"></svg>
</template>

<script lang="ts">
import * as d3 from 'd3';
const dummyData = {
    'post': [
        {
            startTime: 100,
            endTime: 200,
            type: 'end'
        },
        {
            startTime: 400,
            endTime: 400,
            type: 'cache'
        }
    ],
    'author': [
        {
            startTime: 300,
            endTime: 500,
            type: 'end'
        }
    ]
}

const svg = d3.select('#graph');

const maxEndTime = function() {
    const cache = [];
    for (const queryKey in dummyData) {
        dummyData[queryKey].forEach(query => {
            cache.push(query.endTime);
        })
    }
    return Math.max(...cache);
}

function cleanData(data) {
    const cache = [];
    for (const queryKey in data) {
        data[queryKey].forEach(query => {
            cache.push({...query, queryHash: queryKey })
        })
    }
    return cache;
}

const x = d3.scaleLinear()
    .domain([0, maxEndTime()])
    .range([0, sq]);

const y = d3.scaleBand()
    .domain(Object.keys(dummyData))
    .range([0, sq]);

svg.append('g')
    .call(d3.axisLeft(y));

svg.append('g')
    .call(d3.axisBottom(x));

svg.selectAll('.query')
    .data(cleanData(dummyData))
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
    .attr('height', 50)
    .attr('fill', 'blue')
</script>