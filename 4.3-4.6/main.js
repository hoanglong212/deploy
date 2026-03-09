const container = d3.select(".responsive-svg-container");
const BRAND_LIMIT = 15;

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function aggregateByBrand(rows) {
  const grouped = d3.rollups(
    rows,
    (values) => ({
      meanPower: d3.mean(values, (d) => d.avgPower),
      sampleSize: values.length,
    }),
    (d) => d.brand,
  );

  return grouped
    .map(([brand, stats]) => ({
      brand,
      meanPower: stats.meanPower,
      sampleSize: stats.sampleSize,
    }))
    .filter((d) => d.meanPower !== null)
    .sort((a, b) => d3.descending(a.meanPower, b.meanPower))
    .slice(0, BRAND_LIMIT);
}

function renderBrandPowerChart(data) {
  if (!data.length) {
    container.append("p").text("No valid data to display.");
    return;
  }

  container.selectAll("*").remove();

  const longestBrand = d3.max(data, (d) => d.brand.length) || 0;
  const margin = {
    top: 72,
    right: 80,
    bottom: 56,
    left: Math.min(280, Math.max(140, longestBrand * 7)),
  };

  const plotWidth = 920;
  const rowHeight = 24;
  const plotHeight = Math.max(280, data.length * rowHeight);
  const width = plotWidth + margin.left + margin.right;
  const height = plotHeight + margin.top + margin.bottom;

  const svg = container
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto")
    .style("border", "1px solid #222")
    .style("background", "#fff");

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const maxPower = d3.max(data, (d) => d.meanPower) || 0;

  const xScale = d3
    .scaleLinear()
    .domain([0, maxPower * 1.08])
    .nice()
    .range([0, plotWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.brand))
    .range([0, plotHeight])
    .padding(0.15);

  chart
    .append("g")
    .attr("class", "grid")
    .call(d3.axisTop(xScale).ticks(10).tickSize(-plotHeight).tickFormat(""))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll("line").attr("stroke", "#d9d9d9"));

  chart
    .append("g")
    .call(d3.axisLeft(yScale))
    .call((g) => g.select(".domain").attr("stroke", "#444"))
    .call((g) => g.selectAll("text").style("font-size", "12px"));

  chart
    .append("g")
    .attr("transform", `translate(0,${plotHeight})`)
    .call(d3.axisBottom(xScale).ticks(10))
    .call((g) => g.select(".domain").attr("stroke", "#444"));

  chart
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", (d) => yScale(d.brand))
    .attr("width", (d) => xScale(d.meanPower))
    .attr("height", yScale.bandwidth())
    .attr("fill", "#2f7ed8");

  chart
    .selectAll(".value-label")
    .data(data)
    .join("text")
    .attr("class", "value-label")
    .attr("x", (d) => xScale(d.meanPower) + 6)
    .attr("y", (d) => (yScale(d.brand) || 0) + yScale.bandwidth() / 2 + 4)
    .style("font-size", "11px")
    .text((d) => `${d.meanPower.toFixed(1)} W`);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "700")
    .text(`Top ${BRAND_LIMIT} Brands by Average TV Power Consumption`);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 52)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#555")
    .text(`Source: output.csv | Brands: ${data.length}`);

  svg
    .append("text")
    .attr("x", margin.left + plotWidth / 2)
    .attr("y", height - 14)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .text("Mean Avg Mode Power (W)");
}

d3.csv("data/output.csv", (d) => ({
  brand: d.Brand_Reg?.trim(),
  modelNo: d.Model_No?.trim(),
  avgPower: toNumber(d.Avg_mode_power),
}))
  .then((rows) => rows.filter((d) => d.brand && d.avgPower !== null))
  .then(aggregateByBrand)
  .then(renderBrandPowerChart)
  .catch((err) => {
    console.error("Failed to load chart data:", err);
    container.selectAll("*").remove();
    container
      .append("p")
      .style("color", "#b00020")
      .text("Cannot load data/output.csv. Check path or file format.");
  });
