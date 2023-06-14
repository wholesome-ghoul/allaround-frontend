import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import wtf from "./index";

const BarChart = ({ data }: any) => {
  const chartRef = useRef(null);
  const svg = useRef(null);

  useEffect(() => {
    if (svg.current) {
      (svg.current as any).appendChild(wtf())
    }

    if (data && chartRef.current) {
      const svg = d3.select(chartRef.current);

      // Clear previous chart
      svg.selectAll("*").remove();

      // Set up chart dimensions
      const width = 400;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Set up x and y scales
      const xScale = d3
        .scaleBand()
        .domain(data.map((d: any) => d.label))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => (d as any).value)] as any)
        .range([innerHeight, 0]);

      // Create x and y axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Add chart elements
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis);

      g.append("g").attr("class", "y-axis").call(yAxis);

      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d: any) => xScale(d.label) as any)
        .attr("y", (d) => yScale((d as any).value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => innerHeight - yScale((d as any).value));
    }
  }, [data]);

  return (
    <div>
      <svg ref={chartRef} width="400" height="300"></svg>
      <div ref={svg}/>
    </div>
  );
};

const data = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 15 },
];

function App() {
  return (
    <div>
      <h1>Bar Chart Example</h1>
      <BarChart data={data} />
    </div>
  );
}

export default App;
