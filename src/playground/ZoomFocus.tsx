import { useEffect, useRef } from "react";
import * as d3 from "d3";

import { aapl } from "./index";

const ZoomFocus = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);

      svg.selectAll("*").remove();

      const width = 1100;
      const height = 800;
      const margin = { top: 20, right: 20, bottom: 30, left: 30 };

      svg.attr("viewBox", [0, 0, width, height]);

      const x = d3
        .scaleUtc()
        .domain(d3.extent(aapl, (d) => d.date) as any)
        .range([margin.left, width - margin.right]);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(aapl, (d) => d.price)] as any)
        .nice()
        .range([height - margin.bottom, margin.top]);
      const xAxis = (g: any, x: any) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );
      const yAxis = (g: any, y: any) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, "s"))
          .call((g: any) => g.select(".domain").remove())
          .call((g: any) =>
            g
              .select(".tick:last-of-type text")
              .clone()
              .attr("x", 3)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text("WTF")
          );

      const area = (data: any, x: any) =>
        d3
          .area()
          .curve(d3.curveStepAfter)
          .x((d) => x((d as any).date))
          .y0(y(0))
          .y1((d) => y((d as any).price))(data);

      const zoomed = (event: any) => {
        const xz = event.transform.rescaleX(x);
        path.attr("d", area(aapl, xz));
        gx.call(xAxis, xz);
      };

      const zoom = d3
        .zoom()
        .scaleExtent([1, 32])
        .extent([
          [margin.left, 0],
          [width - margin.right, height],
        ])
        .translateExtent([
          [margin.left, -Infinity],
          [width - margin.right, Infinity],
        ])
        .on("zoom", zoomed);

        const clip = "clipid"

      svg
        .append("clipPath")
        .attr("id", clip)
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom);

      const path = svg
        .append("path")
        .attr("clip-path", new URL(`#${clip}`, location.href) as any)
        .attr("fill", "steelblue")
        .attr("d", area(aapl, x));

      const gx = svg.append("g").call(xAxis, x);

      svg.append("g").call(yAxis, y);

      svg
        .call(zoom as any)
        .transition()
        .duration(750)
        .call((zoom as any).scaleTo, 4, [x(Date.UTC(2001, 8, 1)), 0]);
    }
  }, []);

  function AreaChart(
    data: any,
    {
      x = ([x]: any) => x, // given d in data, returns the (temporal) x-value
      y = ([, y]: any) => y, // given d in data, returns the (quantitative) y-value
      defined, // given d in data, returns true if defined (for gaps)
      curve = d3.curveLinear, // method of interpolation between points
      marginTop = 20, // top margin, in pixels
      marginRight = 30, // right margin, in pixels
      marginBottom = 30, // bottom margin, in pixels
      marginLeft = 40, // left margin, in pixels
      width = 640, // outer width, in pixels
      height = 400, // outer height, in pixels
      xType = d3.scaleUtc, // type of x-scale
      xDomain, // [xmin, xmax]
      xRange = [marginLeft, width - marginRight], // [left, right]
      yType = d3.scaleLinear, // type of y-scale
      yDomain, // [ymin, ymax]
      yRange = [height - marginBottom, marginTop], // [bottom, top]
      yFormat, // a format specifier string for the y-axis
      yLabel, // a label for the y-axis
      color = "currentColor", // fill color of area
    }: any = {}
  ) {
    // Compute values.
    console.log("WTF");
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);

    // Compute which data points are considered defined.
    if (defined === undefined)
      defined = (d: any, i: any) => !isNaN(X[i] as any) && !isNaN(Y[i] as any);
    const D = d3.map(data, defined);

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X as any);
    if (yDomain === undefined) yDomain = [0, d3.max(Y as any)];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 80)
      .tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // Construct an area generator.
    const area = d3
      .area()
      .defined((i) => D[i as any] as any)
      .curve(curve)
      .x((i) => xScale(X[i as any]))
      .y0(yScale(0))
      .y1((i) => yScale(Y[i as any]));

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel)
      );

    svg
      .append("path")
      .attr("fill", color)
      .attr("d", area(I as any));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    return svg.node();
  }

  return <svg ref={chartRef}></svg>;
};

export default ZoomFocus;
