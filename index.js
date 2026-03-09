function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  const targetPage = document.getElementById(pageId);
  const targetNav = document.getElementById(`nav-${pageId}`);

  if (!targetPage || !targetNav) {
    return;
  }

  pages.forEach((page) => page.classList.remove("active"));
  targetPage.classList.add("active");

  const navItems = document.querySelectorAll(".nav li");
  navItems.forEach((item) => item.classList.remove("active"));
  targetNav.classList.add("active");
}

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function calcElectricCost(powerW) {
  const hoursPerDay = 4;
  const pricePerKWh = 0.35;
  const power = toNumber(powerW);

  if (power === null) {
    return "0.00";
  }

  const kWhPerYear = (power / 1000) * hoursPerDay * 365;
  return (kWhPerYear * pricePerKWh).toFixed(2);
}

function renderTV(tvs) {
  const container = document.querySelector(".tv-grid");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const descriptions = {
    best: "Most energy efficient option for everyday viewing",
    popular: "Balanced performance and energy consumption",
    premium: "Premium picture quality with moderate efficiency",
    outdated: "High energy consumption, consider upgrading",
  };

  tvs.forEach((tv) => {
    const power = toNumber(tv.Avg_mode_power);

    if (power === null) {
      return;
    }

    let badgeClass = "outdated";
    let badgeText = "Outdated";

    if (power <= 100) {
      badgeClass = "best";
      badgeText = "Best Value";
    } else if (power <= 200) {
      badgeClass = "popular";
      badgeText = "Popular";
    } else if (power <= 250) {
      badgeClass = "premium";
      badgeText = "Premium";
    }

    const card = document.createElement("div");
    card.classList.add("tv-card");
    card.innerHTML = `
      <div class="badge ${badgeClass}">${badgeText}</div>
      <h3>${tv.Brand_Reg} ${tv.Model_No}</h3>
      <p>Screen Tech: ${tv.Screen_Tech}</p>
      <p>Screen Size: ${tv.ScreenSize_Category}</p>
      <div class="energy-display">
        <div class="watt-value">${power}W</div>
      </div>
      <div class="cost-tag">$${calcElectricCost(power)}/year</div>
      <p class="description">${descriptions[badgeClass]}</p>
      <p>Sold In: ${tv.SoldIn}</p>
      <p>Star Rating: ${tv.Star2}</p>
    `;

    container.appendChild(card);
  });
}

function initTVCards() {
  if (!window.Papa) {
    console.error("Papa Parse failed to load.");
    return;
  }

  fetch("./data/output.csv")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load data/output.csv (${res.status})`);
      }

      return res.text();
    })
    .then((csvText) => {
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });
      const tvData = parsed.data;

      const bestValue = tvData
        .filter((tv) => {
          const power = toNumber(tv.Avg_mode_power);
          return power !== null && power <= 100;
        })
        .sort(
          (a, b) => toNumber(a.Avg_mode_power) - toNumber(b.Avg_mode_power),
        )[0];

      const popular = tvData
        .filter((tv) => {
          const power = toNumber(tv.Avg_mode_power);
          return power !== null && power > 100 && power <= 200;
        })
        .sort((a, b) => toNumber(b.Star2) - toNumber(a.Star2))[0];

      const premium = tvData
        .filter((tv) => {
          const power = toNumber(tv.Avg_mode_power);
          return power !== null && power > 200 && power <= 250;
        })
        .sort((a, b) => toNumber(b.Star2) - toNumber(a.Star2))[0];

      const outdated = tvData
        .filter((tv) => {
          const power = toNumber(tv.Avg_mode_power);
          return power !== null && power > 250;
        })
        .sort(
          (a, b) => toNumber(b.Avg_mode_power) - toNumber(a.Avg_mode_power),
        )[0];

      renderTV([bestValue, popular, premium, outdated].filter(Boolean));
    })
    .catch((err) => console.error("Error fetching CSV:", err));
}

function createChartSvg(containerSelector, width, height, margin) {
  const container = d3.select(containerSelector);

  if (container.empty()) {
    return null;
  }

  container.selectAll("*").remove();

  return container
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto")
    .style("border", "1px solid black")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
}

function createScatterPlot(data, svg, width, height) {
  if (!svg) {
    return;
  }

  const categories = [
    "22 inch",
    "32 inch",
    "43 inch",
    "50 inch",
    "55 inch",
    "65 inch",
    "75 inch+",
  ];

  const labelMap = {
    "22 inch": "< 20",
    "32 inch": "21-29",
    "43 inch": "30-39",
    "50 inch": "40-49",
    "55 inch": "50-59",
    "65 inch": "60-69",
    "75 inch+": ">= 70",
  };

  const filteredData = data.filter(
    (d) => categories.includes(d.screenSize) && d.avgPower !== null,
  );

  const xScale = d3
    .scaleBand()
    .domain(categories)
    .range([0, width])
    .padding(0.4);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, (d) => d.avgPower) || 0])
    .nice()
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat((d) => labelMap[d] ?? d));

  svg.append("g").call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Screen Size vs Average Power Consumption");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .text("Average power consumption (W)");

  svg
    .selectAll("circle")
    .data(filteredData)
    .join("circle")
    .attr("cx", (d) => xScale(d.screenSize) + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale(d.avgPower))
    .attr("r", 3)
    .attr("fill", "#4e79a7")
    .attr("opacity", 0.7);
}

function initScatterPlot(width, height, margin) {
  const svg = createChartSvg(
    ".responsive-svg-container",
    width,
    height,
    margin,
  );

  if (!svg) {
    return;
  }

  d3.csv("data/output.csv", (d) => ({
    brand: d.Brand_Reg,
    modelNo: d.Model_No,
    avgPower: toNumber(d.Avg_mode_power),
    screenSize: d.ScreenSize_Category,
  }))
    .then((data) => createScatterPlot(data, svg, width, height))
    .catch((err) => console.error("Error loading scatter plot data:", err));
}

function initTechBarChart(width, height, margin) {
  const svgBar = createChartSvg(".bar-chart-container", width, height, margin);

  if (!svgBar) {
    return;
  }

  d3.csv("data/output2.csv", (d) => ({
    tech: d.Screen_Tech,
    meanPower: toNumber(d["Mean(Avg_mode_power)"]),
  }))
    .then((data) => {
      const order = ["OLED", "LCD"];
      const filteredData = data
        .filter((d) => d.meanPower !== null)
        .sort((a, b) => order.indexOf(a.tech) - order.indexOf(b.tech));

      const x = d3.scaleBand().domain(order).range([0, width]).padding(0.3);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d.meanPower) || 0])
        .nice()
        .range([height, 0]);

      svgBar
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svgBar.append("g").call(d3.axisLeft(y));

      svgBar
        .append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Mean Power Consumption by Screen Technology");

      svgBar
        .selectAll("rect")
        .data(filteredData)
        .join("rect")
        .attr("x", (d) => x(d.tech))
        .attr("y", (d) => y(d.meanPower))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.meanPower))
        .attr("fill", (d) => (d.tech === "OLED" ? "#4e79a7" : "#59a14f"));

      svgBar
        .selectAll(".label")
        .data(filteredData)
        .join("text")
        .attr("class", "label")
        .attr("x", (d) => x(d.tech) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.meanPower) - 5)
        .attr("text-anchor", "middle")
        .text((d) => d.meanPower.toFixed(2));
    })
    .catch((err) => console.error("Error loading technology chart data:", err));
}

function initBrandBarChart(width, height, margin) {
  const brandMargin = { ...margin, bottom: Math.max(margin.bottom, 130) };
  const svgBrand = createChartSvg(
    ".brand-bar-container",
    width,
    height,
    brandMargin,
  );

  if (!svgBrand) {
    return;
  }

  d3.csv("data/output3.csv", (d) => ({
    brand: d.Brand_Reg,
    meanPower: toNumber(d["Mean(Avg_mode_power)"]),
  }))
    .then((data) => {
      const filteredData = data
        .filter((d) => d.meanPower !== null)
        .sort((a, b) => d3.descending(a.meanPower, b.meanPower));

      const color = d3
        .scaleOrdinal()
        .domain(filteredData.map((d) => d.brand))
        .range(d3.schemeTableau10);

      const x = d3
        .scaleBand()
        .domain(filteredData.map((d) => d.brand))
        .range([0, width])
        .padding(0.25);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d.meanPower) || 0])
        .nice()
        .range([height, 0]);

      svgBrand
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

      svgBrand.append("g").call(d3.axisLeft(y));

      svgBrand
        .append("text")
        .attr("x", width / 2)
        .attr("y", -18)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Average Power Consumption by Brand (75 Inch and Above TVs)");

      svgBrand
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -65)
        .attr("text-anchor", "middle")
        .text("Average Power Consumption (Watts)");

      svgBrand
        .selectAll("rect")
        .data(filteredData)
        .join("rect")
        .attr("x", (d) => x(d.brand))
        .attr("y", (d) => y(d.meanPower))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.meanPower))
        .attr("fill", (d) => color(d.brand))
        .attr("opacity", 0.9);

      const legend = svgBrand
        .append("g")
        .attr("transform", `translate(0, ${height + 70})`);

      const itemsPerRow = Math.floor(width / 150) || 1;

      const legendItem = legend
        .selectAll(".legend-item")
        .data(filteredData)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => {
          const col = i % itemsPerRow;
          const row = Math.floor(i / itemsPerRow);
          return `translate(${col * 150}, ${row * 22})`;
        });

      legendItem
        .append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("y", -12)
        .attr("fill", (d) => color(d.brand));

      legendItem
        .append("text")
        .attr("x", 20)
        .attr("y", 0)
        .style("font-size", "12px")
        .text((d) => d.brand);
    })
    .catch((err) => console.error("Error loading brand chart data:", err));
}

function initCharts() {
  if (!window.d3) {
    console.error("D3 failed to load.");
    return;
  }

  const margin = { top: 50, right: 40, bottom: 80, left: 80 };
  const width = 1000 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  initScatterPlot(width, height, margin);
  initTechBarChart(width, height, margin);
  initBrandBarChart(width, height, margin);
}

document.addEventListener("DOMContentLoaded", () => {
  initTVCards();
  initCharts();
});
