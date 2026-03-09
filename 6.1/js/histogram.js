let svgH, gH, barsGH, xAxisGH, yAxisGH;
let histDataAll = [];

function drawHistogram(data) {
  histDataAll = data;

  // Clear container
  d3.select("#chart-hist").selectAll("*").remove();

  svgH = d3
    .select("#chart-hist")
    .append("svg")
    .attr("viewBox", `0 0 ${outerWidth} ${outerHeight}`);

  gH = svgH
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  barsGH = gH.append("g").attr("class", "bars");

  xAxisGH = gH
    .append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0,${innerHeight})`);

  yAxisGH = gH.append("g").attr("class", "axis axis-y");

  // Axis labels
  gH.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 52)
    .attr("text-anchor", "middle")
    .attr("font-weight", 800)
    .attr("fill", "rgba(74,55,40,0.9)")
    .text("Energy Consumption (W)");

  gH.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -52)
    .attr("text-anchor", "middle")
    .attr("font-weight", 800)
    .attr("fill", "rgba(74,55,40,0.9)")
    .text("Frequency");

  // Initial render
  updateHistogramWithData(data, true);
}

function makeBins(data) {
  const extent = d3.extent(data, (d) => d.energyConsumption);
  binGenerator.domain(extent);
  return binGenerator(data);
}

function updateScalesFromBins(bins) {
  const xMin = d3.min(bins, (b) => b.x0);
  const xMax = d3.max(bins, (b) => b.x1);
  const yMax = d3.max(bins, (b) => b.length) || 1;

  xScale.domain([xMin, xMax]);
  yScale.domain([0, yMax]).nice();
}

function renderBars(bins, isInitial = false) {
  const join = barsGH.selectAll("rect").data(bins, (d) => `${d.x0}-${d.x1}`);

  // EXIT
  join
    .exit()
    .transition()
    .duration(250)
    .attr("y", innerHeight)
    .attr("height", 0)
    .remove();

  // UPDATE
  join
    .transition()
    .duration(400)
    .attr("class", "bar-rect")
    .attr("x", (d) => xScale(d.x0) + 1)
    .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
    .attr("y", (d) => yScale(d.length))
    .attr("height", (d) => innerHeight - yScale(d.length));

  // ENTER
  const enter = join
    .enter()
    .append("rect")
    .attr("class", "bar-rect")
    .attr("x", (d) => xScale(d.x0) + 1)
    .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
    .attr("y", innerHeight)
    .attr("height", 0);

  enter
    .transition()
    .duration(isInitial ? 650 : 450)
    .attr("y", (d) => yScale(d.length))
    .attr("height", (d) => innerHeight - yScale(d.length));
}

function renderAxes() {
  xAxisGH.transition().duration(350).call(d3.axisBottom(xScale).ticks(10));
  yAxisGH.transition().duration(350).call(d3.axisLeft(yScale).ticks(8));
}

// Public function: called from interactions.js
function updateHistogramWithData(newData, isInitial = false) {
  const bins = makeBins(newData);
  updateScalesFromBins(bins);
  renderBars(bins, isInitial);
  renderAxes();
}
