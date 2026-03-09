let activeTech = "all";
let activeSize = "all";

function populateFilters(data) {
  buildTechButtons(data);
  buildSizeButtons(data);
  // initial update already rendered, but safe to sync:
  updateHistogramCombined(data);
}

function buildTechButtons(data) {
  const container = d3.select("#filters-tech");

  const btns = container
    .selectAll("button")
    .data(filters_screen, (d) => d.id)
    .join("button")
    .text((d) => d.label)
    .classed("active", (d) => d.isActive)
    .on("click", (event, d) => {
      filters_screen.forEach((x) => (x.isActive = x.id === d.id));
      activeTech = d.id;

      container.selectAll("button").classed("active", (x) => x.id === d.id);

      updateHistogramCombined(data);
    });
}

function buildSizeButtons(data) {
  const container = d3.select("#filters-size");

  container
    .selectAll("button")
    .data(filters_size, (d) => d.id)
    .join("button")
    .text((d) => d.label)
    .classed("active", (d) => d.isActive)
    .on("click", (event, d) => {
      filters_size.forEach((x) => (x.isActive = x.id === d.id));
      activeSize = d.id;

      container.selectAll("button").classed("active", (x) => x.id === d.id);

      updateHistogramCombined(data);
    });
}

function updateHistogramCombined(data) {
  let updated = data;

  if (activeTech !== "all") {
    updated = updated.filter((d) => d.screenTech === activeTech);
  }

  if (activeSize !== "all") {
    const sizeNum = Number(activeSize);
    updated = updated.filter((d) => d.screenSize === sizeNum);
  }

  updateHistogramWithData(updated);
}

// ===============================
// Tooltip events for scatterplot
// ===============================
function attachTooltipEvents() {
  const gS = getScatterGroup();
  const tooltip = getScatterTooltip();

  if (!gS || !tooltip) return;

  gS.selectAll("circle")
    .on("mouseenter", (event, d) => {
      const cx = Number(event.target.getAttribute("cx"));
      const cy = Number(event.target.getAttribute("cy"));

      // update text
      const star = Number.isFinite(d.star) ? d.star : "N/A";
      tooltip.select("text").text(`Size: ${d.screenSize} inch | Star: ${star}`);

      // position tooltip near circle
      const tx = Math.min(cx + 12, innerWidthS - tooltipW);
      const ty = Math.max(cy - tooltipH - 12, 0);

      tooltip
        .attr("transform", `translate(${tx},${ty})`)
        .transition()
        .duration(120)
        .style("opacity", 1);
    })
    .on("mouseleave", () => {
      tooltip
        .transition()
        .duration(150)
        .style("opacity", 0)
        .on("end", () => tooltip.attr("transform", `translate(-999,-999)`));
    });
}
