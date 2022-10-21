export default function AreaChart(container) {
    const margin = {top: 20, right: 30, bottom: 30, left: 300},
        width = 950 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    let svg = d3
        .select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let xScale = d3.scaleTime()
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .range([height, 0]);

    group.append('path')
        .attr('class', 'area');

    const xAxis = d3.axisBottom()
        .scale(xScale);

    let x_labels = group
        .append('g')
        .attr('class', 'axis x-axis')
        .style('font-size', 11)
        .style('font-weight', 'bold');

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(4);

    let y_labels = group
        .append('g')
        .attr('class', 'axis y-axis')
        .style('font-size', 11)
        .style('font-weight', 'bold');

    const listeners = {brushed: null};

    function on(event, listener) {
        listeners[event] = listener;
    }

    const brush = d3
        .brushX()
        .extent([[0, 0], [width, height]])
        .on('brush', brushed)
        .on('end', brush_end);

    group.append("g").attr('class', 'brush').call(brush);

    function brushed(event) {
        const dataRange = event.selection.map(xScale.invert);
        if (event.selection) {
            listeners["brushed"](dataRange);
        }
    }

    function brush_end(event) {
        const dataRange = [xScale.invert(0), xScale.invert(width)];
        if (!event.selection) {
            listeners['brushed'](dataRange);
        }
    }

    function setBrush(timeRange) {
        let range = timeRange.map(xScale);
        group
            .select(".brush")
            .call(brush.move, range);
    }

    function update(data) {
        xScale.domain(d3.extent(data, d=>d.date));
        yScale.domain([0, d3.max(data, d=>d.total)]);

        x_labels
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        y_labels
            .call(yAxis);

        let area = d3.area()
            .x(d => xScale(d.date))
            .y1(d => yScale(d.total))
            .y0(() => yScale.range()[0]);

        d3.select('.area')
            .datum(data)
            .attr('fill', "#8D8CDF")
            .attr('d', area);
    }

    return {
        update, on, setBrush
    };
}