function renderPieChart(data, container) {
  container.innerHTML = '';
  const width = container.clientWidth;
  const height = container.clientHeight;
  const radius = Math.min(width, height) / 2 - 20;

  const reqCounts = {};
  data.forEach(row => {
    row.requirements.forEach(req => {
      reqCounts[req] = (reqCounts[req] || 0) + 1;
    });
  });
  const topReqs = Object.entries(reqCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const total = topReqs.reduce((sum, d) => sum + d[1], 0);

  const pie = d3.pie()
    .value(d => d[1])
    .sort(null);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${radius + 20},${height / 2})`);

  const legendGroup = svg.append("g")
    .attr("transform", `translate(${radius * 2 + 60},${height / 2 - topReqs.length * 18 / 2})`);

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

  const arcs = chartGroup.selectAll(".arc")
    .data(pie(topReqs))
    .enter().append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data[0]))
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);
      tooltip.style("display", "block")
        .html(`<b>${d.data[0]}</b><br>Count: ${d.data[1]}<br>Percent: ${(d.data[1] / total * 100).toFixed(1)}%`);
    })
    .on("mousemove", function(event) {
      tooltip.style("left", (event.clientX + 20) + "px")
        .style("top", (event.clientY - 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("stroke", null);
      tooltip.style("display", "none");
    });

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", "13px")
    .style("fill", "#222")
    .text(d => {
      const percent = d.data[1] / total * 100;
      return percent >= 5 ? `${percent.toFixed(1)}%` : "";
    });

  const legend = legendGroup.selectAll(".legend-item")
    .data(pie(topReqs))
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 18})`);

  legend.append("rect")
    .attr("x", 0)
    .attr("y", -8)
    .attr("width", 16)
    .attr("height", 16)
    .attr("fill", d => color(d.data[0]));

  legend.append("text")
    .attr("x", 24)
    .attr("y", 4)
    .attr("font-size", "13px")
    .attr("fill", "#222")
    .text(d => d.data[0].length > 75 ? d.data[0].slice(0, 75) + "..." : d.data[0]);
}