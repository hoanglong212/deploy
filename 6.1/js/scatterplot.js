let svgS, gS, xAxisGS, yAxisGS, tooltipG;

function drawScatterplot(data) {
  // Clear container
  d3.select("#chart-scatter").selectAll("*").remove();

  svgS = d3
    .select("#chart-scatter")
    .append("svg")
    .attr("viewBox", `0 0 ${outerWidthS} ${outerHeightS}`);

  gS = svgS
    .append("g")
    .attr("transform", `translate(${marginS.left},${marginS.top})`);

  // Scales domains
  const xExtent = d3.extent(data, (d) => d.star);
  const xPad = 0.3;
  const yMax = d3.max(data, (d) => d.energyConsumption) || 1;

  xScaleS.domain([(xExtent[0] ?? 0) - xPad, (xExtent[1] ?? 10) + xPad]).nice();
  yScaleS.domain([0, yMax]).nice();

  // Color scale range (set your own colors if you want)
  colorScale.range(["#2d8cff", "#e69635", "#9b59b6"]);

  // Axes groups
  xAxisGS = gS
    .append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0,${innerHeightS})`)

    .call(d3.axisBottom(xScaleS).ticks(8));

  yAxisGS = gS
    .append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(yScaleS).ticks(8));

  // Labels
  gS.append("text")
    .attr("x", innerWidthS / 2)
    .attr("y", innerHeightS + 52)
    .attr("text-anchor", "middle")
    .attr("font-weight", 800)
    .attr("fill", "rgba(74,55,40,0.9)")
    .text("Star Rating");

  gS.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeightS / 2)
    .attr("y", -52)
    .attr("text-anchor", "middle")
    .attr("font-weight", 800)
    .attr("fill", "rgba(74,55,40,0.9)")
    .text("Energy Consumption (W)");

  // Draw circles
  gS.append("g")
    .attr("class", "points")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScaleS(d.star))
    .attr("cy", (d) => yScaleS(d.energyConsumption))
    .attr("r", 4)
    .attr("fill", (d) => colorScale(d.screenTech))
    .attr("opacity", 0.5);

  // Legend
  addLegend();

  // Tooltip setup (created here, events attached in interactions.js)
  createTooltip();
}

function addLegend() {
  const items = colorScale.domain();

  const legend = gS
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${innerWidthS - 160}, 0)`);

  items.forEach((key, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 22})`);

    row
      .append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 4)
      .attr("fill", colorScale(key))
      .attr("opacity", 0.9);

    row
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("fill", "rgba(74,55,40,0.9)")
      .attr("font-weight", 700)
      .style("font-size", "12px")
      .text(key);
  });
}

function createTooltip() {
  // Group for tooltip
  tooltipG = gS.append("g").attr("class", "tooltip").style("opacity", 0);

  // Background
  tooltipG
    .append("rect")
    .attr("class", "tooltip-bg")
    .attr("width", tooltipW)
    .attr("height", tooltipH)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("opacity", 0.85);

  // Text
  tooltipG
    .append("text")
    .attr("class", "tooltip-text")
    .attr("x", 10)
    .attr("y", 22)
    .style("font-size", "12px")
    .text("");
}

// Helper getters used by interactions.js
function getScatterTooltip() {
  return tooltipG;
}

function getScatterGroup() {
  return gS;
}
