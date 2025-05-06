function renderHistChart(data, container) {
  container.innerHTML = '';
  const margin = {top: 40, right: 20, bottom: 60, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  const years = data.map(d => d.experience_years).filter(d => typeof d === "number" && !isNaN(d));

  const bins = d3.bin()
    .domain([0, d3.max(years) || 10])
    .thresholds(10)(years);

  const x = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.x1) || 10])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .range([height, 0]);

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(10))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "#222")
    .attr("text-anchor", "middle")
    .text("Experience Years");

  svg.append("g")
    .call(d3.axisLeft(y));

const tooltip = d3.select(document.body)
  .append("div")
  .attr("class", "d3-tooltip")
  .style("position", "fixed")
  .style("background", "rgba(0,0,0,0.8)")
  .style("color", "#fff")
  .style("padding", "4px 8px")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("font-size", "13px")
  .style("display", "none");

  svg.selectAll(".bar")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.x0) + 1)
    .attr("y", d => y(d.length))
    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 2))
    .attr("height", d => height - y(d.length))
    .attr("fill", "#00b894")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "#fdcb6e");
      tooltip.style("display", "block")
        .html(`<b>${d.x0}–${d.x1} years</b><br>Count: ${d.length}`);
    })
    .on("mousemove", function(event) {
      tooltip.style("left", (event.clientX + 20) + "px")
        .style("top", (event.clientY - 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "#00b894");
      tooltip.style("display", "none");
    });
}