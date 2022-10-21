import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

var number;

d3.csv('unemployment.csv', d3.autoType).then(data => {
    number = data;

    let bottom = number.columns.slice(1);

    number.forEach(d=> {
        let total = 0;
        bottom.forEach(element => total += d[element]);
        d.total = total;
    });

    const area_chart = AreaChart(".area_chart");
    area_chart.update(number);

    const stacked_chart = StackedAreaChart(".stacked_chart");
    stacked_chart.update(number);

    area_chart.on("brushed", range=> {
        stacked_chart.filterByDate(range);
    });
    
    stacked_chart.on("zoomed", timeRange=> {
        area_chart.setBrush(timeRange);
    });
});