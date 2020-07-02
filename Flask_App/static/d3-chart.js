let margin = {left:30,top:30,bottom:100,right:30},
width = d3.select('#main-chart').node().offsetWidth - margin.left - margin.right,
height = 450 - margin.bottom - margin.top;

//Create X-axis Band scaling generator
let x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);

//Create Y-axis Linear scaling generator
let y = d3.scaleLinear()
          .range([height,0]);

//Create main SVG element
let svg = d3.select('#main-chart')
              .style('border','1px solid black')
              .append('svg')
              .attr('height',height + margin.top + margin.bottom)
              .attr('width',width + margin.left + margin.right)
              .append('g')
              .attr('transform', `translate(${margin.left}, ${margin.top})`)

//Fetch data from CSV
d3.dsv(',', 'static/sales.csv', (d) => {
    d.sales = parseInt(d.sales);
    return d;
}).then((results) => {
  let maxVal = d3.max(results.map(x => x.sales));
  let countVal = results.length;

  d3.select('.limit').text(countVal + ' (total)');
  d3.select('#filter-slider')
    .attr('value',countVal)
    .attr('max',countVal)
    .attr('title',countVal)

//Color picker onchange event to dynamically render colors based on selection
let colorSelector = document.getElementById('color-selector');
  colorSelector.onchange = () => {
    createBars(results);
  };

  //Slider onchange event to dynamically render top selected flavors
  let slider = document.getElementById('filter-slider');
  slider.onchange = () => {
        d3.select('#filter-slider').attr('title',slider.value);

        sorted = results.map(x => x.sales).sort(function(a, b) {
          return b - a;
        });
        // console.log(sorted);
        for(i=1;i<=countVal;i++){
            results.forEach(function(obj){
               if(obj.sales == sorted[i-1]){
                    obj.order = i;
               }
            });
        }
        // console.log(results);
        let filteredData = results.filter(d => d.order <= slider.value);
        console.log(filteredData);
        createBars(filteredData);
    }
  x.domain(results.map(x => x.flavors));
  y.domain([0, maxVal])
   .nice();

  //Append axes to SVG
  svg.append('g')
     .call(d3.axisLeft(y));

  svg.append('g')
     .attr('transform',`translate(0,${height})`)
     .call(d3.axisBottom(x))
     .selectAll('text')
     .attr('x',10)
     .attr('y',0)
     .attr('dy','0.35em')
     .attr('transform','rotate(90)')
     .attr('text-anchor','start');

    createBars(results);

}).catch((error) => {
    throw error;
})

//Function to render content of SVG
function createBars(results){
  svg.selectAll('.bar-group')
             .data(results, d=>d.flavors)
             .join(
                enter => {
                           let bars = enter
                                 .append('g')
                                 .attr('class','bar-group')
                                 .style('opacity',1);

                                bars.append('rect')
                                  .attr('class','bar')
                                  .attr('x',d => x(d.flavors))
                                  .attr('y',d => y(0))
                                  .attr('width',x.bandwidth())
                                  .attr('height',0)
                                  .style('fill',d3.select('#color-selector').node().value)
                                  .transition()
                                  .duration(1000)
                                    .attr('y',d => y(d.sales))
                                    .attr('height',d => height - y(d.sales))

                                  bars.append('text')
                                     .text(d => d.sales)
                                     .attr('x',d => x(d.flavors) + x.bandwidth()/2)
                                     .attr('y',d => y(d.sales)-5)
                                     .attr('text-anchor','middle')
                                     .style('font-size',12)
                                     .style('opacity',0)
                                     .transition()
                                        .duration(700)
                                        .style('opacity',1)
                },
                update => {
                            update.select('rect').style('fill',d3.select('#color-selector').node().value)
                            update.transition()
                                .duration(700)
                                .style('opacity',1)
                },
                exit => {
                            exit.transition()
                                .duration(700)
                                .style('opacity',0.15)
                }
             )
}