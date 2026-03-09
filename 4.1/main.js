d3.select("h1").style("color", "#2f6b24");

const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1100 800")
  .style("border", "1px solid #3f3f3f");

const defs = svg.append("defs");

const skyGradient = defs
  .append("linearGradient")
  .attr("id", "sky-gradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "0%")
  .attr("y2", "100%");

skyGradient.append("stop").attr("offset", "0%").attr("stop-color", "#bfe8ff");
skyGradient.append("stop").attr("offset", "100%").attr("stop-color", "#f4fbff");

const grassGradient = defs
  .append("linearGradient")
  .attr("id", "grass-gradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "0%")
  .attr("y2", "100%");

grassGradient.append("stop").attr("offset", "0%").attr("stop-color", "#7ecb5f");
grassGradient
  .append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#4e9b3f");

svg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 1100)
  .attr("height", 800)
  .attr("fill", "url(#sky-gradient)");

const sun = svg.append("g").attr("transform", "translate(930,120)");

sun
  .append("circle")
  .attr("r", 46)
  .attr("fill", "#ffd55a")
  .attr("stroke", "#e0ad2f")
  .attr("stroke-width", 4);

for (let i = 0; i < 12; i += 1) {
  const angle = (i * Math.PI) / 6;
  sun
    .append("line")
    .attr("x1", Math.cos(angle) * 58)
    .attr("y1", Math.sin(angle) * 58)
    .attr("x2", Math.cos(angle) * 80)
    .attr("y2", Math.sin(angle) * 80)
    .attr("stroke", "#f2bb3f")
    .attr("stroke-width", 4)
    .attr("stroke-linecap", "round");
}

function drawCloud(x, y, scale) {
  const cloud = svg
    .append("g")
    .attr("transform", `translate(${x}, ${y}) scale(${scale})`);
  cloud
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 28)
    .attr("fill", "#ffffff");
  cloud
    .append("circle")
    .attr("cx", 26)
    .attr("cy", -14)
    .attr("r", 22)
    .attr("fill", "#ffffff");
  cloud
    .append("circle")
    .attr("cx", 52)
    .attr("cy", 0)
    .attr("r", 28)
    .attr("fill", "#ffffff");
  cloud
    .append("ellipse")
    .attr("cx", 26)
    .attr("cy", 12)
    .attr("rx", 58)
    .attr("ry", 22)
    .attr("fill", "#ffffff");
}

drawCloud(140, 120, 1);
drawCloud(300, 90, 0.8);
drawCloud(720, 160, 0.9);

svg
  .append("ellipse")
  .attr("cx", 550)
  .attr("cy", 590)
  .attr("rx", 560)
  .attr("ry", 240)
  .attr("fill", "url(#grass-gradient)")
  .attr("stroke", "#3f7a32")
  .attr("stroke-width", 2);

svg
  .append("path")
  .attr("d", "M 500 450 Q 550 520 560 800 L 470 800 Q 455 530 500 450 Z")
  .attr("fill", "#d8c2a2")
  .attr("stroke", "#987a5b")
  .attr("stroke-width", 2);

const house = svg.append("g").attr("id", "house");

house
  .append("rect")
  .attr("x", 330)
  .attr("y", 200)
  .attr("width", 400)
  .attr("height", 250)
  .attr("fill", "#f4e5c0")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 4);

house
  .append("polygon")
  .attr("points", "310,210 750,210 530,90")
  .attr("fill", "#b53e37")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 4);

house
  .append("line")
  .attr("x1", 320)
  .attr("y1", 210)
  .attr("x2", 740)
  .attr("y2", 210)
  .attr("stroke", "#94312d")
  .attr("stroke-width", 6);

house
  .append("rect")
  .attr("x", 628)
  .attr("y", 112)
  .attr("width", 44)
  .attr("height", 98)
  .attr("fill", "#8d5e3c")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 3);

house
  .append("rect")
  .attr("x", 620)
  .attr("y", 102)
  .attr("width", 60)
  .attr("height", 12)
  .attr("fill", "#6f452b")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);

const smoke = house.append("g");
smoke
  .append("circle")
  .attr("cx", 650)
  .attr("cy", 78)
  .attr("r", 10)
  .attr("fill", "#f2f2f2")
  .attr("opacity", 0.9);
smoke
  .append("circle")
  .attr("cx", 664)
  .attr("cy", 58)
  .attr("r", 14)
  .attr("fill", "#ececec")
  .attr("opacity", 0.75);
smoke
  .append("circle")
  .attr("cx", 646)
  .attr("cy", 42)
  .attr("r", 16)
  .attr("fill", "#e5e5e5")
  .attr("opacity", 0.6);

house
  .append("rect")
  .attr("x", 487)
  .attr("y", 316)
  .attr("width", 86)
  .attr("height", 134)
  .attr("fill", "#8b4f2b")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 3);

house
  .append("rect")
  .attr("x", 500)
  .attr("y", 330)
  .attr("width", 60)
  .attr("height", 44)
  .attr("fill", "#d4efff")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);

house
  .append("line")
  .attr("x1", 530)
  .attr("y1", 330)
  .attr("x2", 530)
  .attr("y2", 374)
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 1.5);

house
  .append("line")
  .attr("x1", 500)
  .attr("y1", 352)
  .attr("x2", 560)
  .attr("y2", 352)
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 1.5);

house
  .append("circle")
  .attr("cx", 553)
  .attr("cy", 388)
  .attr("r", 6)
  .attr("fill", "#f4d26a")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);

house
  .append("rect")
  .attr("x", 470)
  .attr("y", 450)
  .attr("width", 120)
  .attr("height", 12)
  .attr("fill", "#9c9c9c")
  .attr("stroke", "#4e4e4e")
  .attr("stroke-width", 2);

house
  .append("rect")
  .attr("x", 460)
  .attr("y", 462)
  .attr("width", 140)
  .attr("height", 14)
  .attr("fill", "#8a8a8a")
  .attr("stroke", "#4e4e4e")
  .attr("stroke-width", 2);

function drawWindow(x) {
  const windowGroup = house
    .append("g")
    .attr("transform", `translate(${x}, 248)`);
  windowGroup
    .append("rect")
    .attr("width", 80)
    .attr("height", 76)
    .attr("fill", "#d8f2ff")
    .attr("stroke", "#2d2d2d")
    .attr("stroke-width", 3);
  windowGroup
    .append("line")
    .attr("x1", 40)
    .attr("y1", 0)
    .attr("x2", 40)
    .attr("y2", 76)
    .attr("stroke", "#2d2d2d")
    .attr("stroke-width", 2);
  windowGroup
    .append("line")
    .attr("x1", 0)
    .attr("y1", 38)
    .attr("x2", 80)
    .attr("y2", 38)
    .attr("stroke", "#2d2d2d")
    .attr("stroke-width", 2);
  windowGroup
    .append("rect")
    .attr("x", -8)
    .attr("y", 76)
    .attr("width", 96)
    .attr("height", 14)
    .attr("fill", "#815332")
    .attr("stroke", "#2d2d2d")
    .attr("stroke-width", 2);
}

drawWindow(375);
drawWindow(645 - 80);

const tree = svg.append("g").attr("transform", "translate(190,350)");
tree
  .append("rect")
  .attr("x", 0)
  .attr("y", 90)
  .attr("width", 36)
  .attr("height", 140)
  .attr("fill", "#7c4e2d")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);
tree
  .append("circle")
  .attr("cx", 18)
  .attr("cy", 68)
  .attr("r", 56)
  .attr("fill", "#3f9e41")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);
tree
  .append("circle")
  .attr("cx", -20)
  .attr("cy", 94)
  .attr("r", 38)
  .attr("fill", "#4baa45")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);
tree
  .append("circle")
  .attr("cx", 54)
  .attr("cy", 98)
  .attr("r", 40)
  .attr("fill", "#49a846")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);

const bushes = svg.append("g");
bushes
  .append("circle")
  .attr("cx", 360)
  .attr("cy", 465)
  .attr("r", 34)
  .attr("fill", "#4aa948")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);
bushes
  .append("circle")
  .attr("cx", 404)
  .attr("cy", 468)
  .attr("r", 30)
  .attr("fill", "#56b24d")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);
bushes
  .append("circle")
  .attr("cx", 698)
  .attr("cy", 468)
  .attr("r", 30)
  .attr("fill", "#56b24d")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);
bushes
  .append("circle")
  .attr("cx", 740)
  .attr("cy", 465)
  .attr("r", 34)
  .attr("fill", "#4aa948")
  .attr("stroke", "#2d2d2d")
  .attr("stroke-width", 2);
