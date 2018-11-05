// var hours = {};

// function makeChart(){
//  const svg = d3.select('#chartDiv')
//     .append('svg')
//     .attr('width', 600)
//     .attr('height', 600);
    
//     //create margins and dims
//     const margin = {top: 20, right: 20, bottom: 100, left: 100};
//     const graphWidth = 600 - margin.left - margin.right;
//     const graphHeight = 600 - margin.top - margin.bottom;
    
//     const graph = svg.append('g')
//     .attr('width', graphWidth )
//     .attr('height', graphHeight)
//     .attr('transform', `translate(${margin.left},${margin.top})`);
    
//     const xAxisGroup = graph.append('g')
//         .attr('transform', `translate(0, ${graphHeight})`);
//      const yAxisGroup = graph.append('g');


//  d3.json('https://www.worldtides.info/api?heights&lat='+lat+'&lon='+lon+'&key=050b6b82-e0ab-48a4-a8f7-6da744f09782',function(JSON){

//     var  Data = JSON.heights;
//       console.log(Data);
    
   

    
//   const rects = graph.selectAll('rect')
//     .data(Data);
//     console.log(data)
    
//     const y =d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.swellHeight )])
//         .range([ graphHeight, 0]);
        
        
//     const x = d3.scaleBand()
//         .domain(data.map(item => item.time))
//         .range([0, 500])
//         .paddingInner(0.2)
//         .paddingOuter(0.2);
    
   
    
//     rects.attr('width', x.bandwidth)
//         .attr('height', d => graphHeight - y(d.swellHeight))
//         .attr('fill', 'orange')
//         .attr('x', (d,i) => x(d.time))
//          .attr('y', d => y(d.swellHeight));
    
//     rects.enter()
//     .append('rect')
//         .attr('width', x.bandwidth())
//         .attr('height', d => graphHeight - y(d.swellHeight))
//         .attr('fill', 'orange')
//         .attr('x', d => x(d.time))
//         .attr('y', d => y(d.swellHeight));
        
//         const xAxis = d3.axisBottom(x);
//         const yAxis = d3. axisLeft(y)
//         .ticks(4)
//         .tickFormat(d => d + ' orders');
        
//         xAxisGroup.call(xAxis);
//         yAxisGroup.call(yAxis);
//         xAxisGroup.selectAll('text')
//         .attr('transform', 'rotate(-40)')
//         .attr('text-anchor', 'end');
   
      
//                     });
//                     }
//  makeChart();