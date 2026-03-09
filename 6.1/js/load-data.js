// Load once and draw both charts + setup filters + tooltip events
d3.csv("data/Ex6_TVdata.csv", (d) => {
  // Robust parsing: adapt if column names differ
  const brand = d.brand ?? d.Brand_Reg ?? d.Brand ?? "";
  const model = d.model ?? d.Model_No ?? d.Model ?? "";

  const starRaw = d.star ?? d.Star2 ?? d.star2 ?? d.Star ?? "0";
  const energyRaw =
    d.energyConsumption ?? d.Avg_mode_power ?? d.avgPower ?? d.AvgPower ?? "0";

  const tech = d.screenTech ?? d.Screen_Tech ?? d.ScreenTech ?? "";
  const sizeRaw = d.screenSize ?? d.ScreenSize ?? d.screen_size ?? "0";

  return {
    brand,
    model,
    star: +starRaw,
    energyConsumption: +energyRaw,
    screenTech: tech,
    screenSize: +sizeRaw,
  };
})
  .then((data) => {
    console.log("rows:", data.length);
    console.log("sample:", data.slice(0, 5));

    drawHistogram(data);
    populateFilters(data);

    drawScatterplot(data);
    attachTooltipEvents();
  })
  .catch((err) => console.error(err));
