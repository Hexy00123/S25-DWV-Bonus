function renderBarChart(data, container) {
  container.innerHTML = '';
  const margin = {top: 40, right: 20, bottom: 40, left: 320};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  const reqCounts = {};
  data.forEach(row => {
    row.requirements.forEach(req => {
      reqCounts[req] = (reqCounts[req] || 0) + 1;
    });
  });
  const topReqs = Object.entries(reqCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
    .domain(topReqs.map(d => d[0].length > 50 ? d[0].slice(0, 50) + "..." : d[0]))
    .range([0, height])
    .padding(0.2);

  const x = d3.scaleLinear()
    .domain([0, d3.max(topReqs, d => d[1])])
    .range([0, width]);

  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5));

  d3.selectAll("body > div.d3-tooltip").remove();
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
    .data(topReqs)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d[0].length > 50 ? d[0].slice(0, 50) + "..." : d[0]))
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("width", d => x(d[1]))
    .attr("fill", "#0077ff")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "#ffaa00");
      tooltip.style("display", "block")
        .html(`<b>${d[0]}</b><br>Count: ${d[1]}`); 
    })
    .on("mousemove", function(event) {
      tooltip.style("left", (event.clientX + 20) + "px")
        .style("top", (event.clientY - 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "#0077ff");
      tooltip.style("display", "none");
    });
}