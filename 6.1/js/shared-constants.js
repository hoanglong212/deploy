// ===============================
// Shared constants (Histogram)
// ===============================
const outerWidth = 1000;
const outerHeight = 520;
const margin = { top: 50, right: 30, bottom: 70, left: 70 };
const innerWidth = outerWidth - margin.left - margin.right;
const innerHeight = outerHeight - margin.top - margin.bottom;

// Histogram scales
const xScale = d3.scaleLinear().range([0, innerWidth]);
const yScale = d3.scaleLinear().range([innerHeight, 0]);

// Bin generator for histogram
const binGenerator = d3
  .bin()
  .value((d) => d.energyConsumption)
  .thresholds(50);

// Filters
const filters_screen = [
  { id: "all", label: "All", isActive: true },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "LED", label: "LED", isActive: false },
  { id: "OLED", label: "OLED", isActive: false },
];

// Suggested sizes (you can change)
const filters_size = [
  { id: "all", label: "All", isActive: true },
  { id: 24, label: "24", isActive: false },
  { id: 32, label: "32", isActive: false },
  { id: 55, label: "55", isActive: false },
  { id: 65, label: "65", isActive: false },
  { id: 98, label: "98", isActive: false },
];

// ===============================
// Shared constants (Scatterplot)
// (must be separate from histogram)
// ===============================
const outerWidthS = 1000;
const outerHeightS = 520;
const marginS = { top: 50, right: 30, bottom: 70, left: 70 };
const innerWidthS = outerWidthS - marginS.left - marginS.right;
const innerHeightS = outerHeightS - marginS.top - marginS.bottom;

const xScaleS = d3.scaleLinear().range([0, innerWidthS]); // star rating
const yScaleS = d3.scaleLinear().range([innerHeightS, 0]); // energy

const colorScale = d3.scaleOrdinal().domain(["LCD", "LED", "OLED"]);

// Tooltip dimensions
const tooltipW = 240;
const tooltipH = 34;
