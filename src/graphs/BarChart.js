import React, {Component} from "react"
import * as d3 from "d3"

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() { // preprocessing on long running task so it doesnt affect rendering process, in dev mode- doesnt work right, only mounts 1 time at the beginning, then updates
        // console.log(this.props.data)
    }

    componentDidUpdate() { // preprocessing on long running task so it doesnt affect rendering process
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 50, bottom: 50, left: 50 };
        var w = (this.props.width/2) - margin.left - margin.right - 4;
        var h = (this.props.height*.45) - margin.top - margin.bottom;

        var data = this.props.data;
        var x = this.props.x;
        var y = this.props.y;
        const xAxisTitle = this.props.xAxisTitle;
        const yAxisTitle = this.props.yAxisTitle;
        var font_size = 12

        var temp_data = d3.flatRollup(
            data,
            (d) => d3.mean((d.map(obj=>obj[y])), m => m),
            (d) => d[x]
        );
        temp_data.reverse()

        d3.select('.bar').select('g').selectAll('*').remove();
        
        var container = d3
        .select(".bar")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .select(".g_2")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        container.append("rect")
        .attr("width", w - margin.left)
        .attr("height", h)
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("fill", "#EEEEEE");

        // X axis
        var x_data = temp_data.map((item) => item[0]);
        if (x === 'day') {
            x_data.sort(this.sortDays)
        }
        var x_scale = d3
        .scaleBand()
        .domain(x_data)
        .range([margin.left, w])
        .padding(0.2);

        container
        .selectAll(".x_axis_g")
        .data([0])
        .join("g")
        .attr("class", "x_axis_g")
        .attr("transform", `translate(0, ${h})`)
        .call(d3.axisBottom(x_scale));
        
        // Add Y axis
        var y_data = temp_data.map((item) => item[1]);
        var y_ticks = d3.range(0,d3.max(y_data)+Math.ceil(d3.max(y_data)/5), Math.ceil(d3.max(y_data)/5));
        var y_scale = d3
        .scaleLinear()
        .domain([0, d3.max(y_data)+d3.max(y_data)/10])
        .range([h, 0]);

        container
        .selectAll(".y_axis_g")
        .data([0])
        .join("g")
        .attr("class", "y_axis_g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_scale).tickValues(y_ticks));

        container
        .selectAll(".rect")
        .data(temp_data)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x_scale(d[0]);
        })
        .attr("y", function (d) {
            return y_scale(d[1]);
        })
        .attr("width", x_scale.bandwidth())
        .attr("height", function (d) {
            return h - y_scale(d[1]);
        })
        .attr("fill", "gray")
        .each(function(d) {
            d3.select(this.parentNode)
            .append("text")
            .attr("x", x_scale(d[0]) + x_scale.bandwidth()/2)
            .attr("y", y_scale(d[1]) + font_size*1.5)
            .attr('text-anchor', "middle")
            .style("fill", "black")
            .text(d[1].toFixed(6))
        });

        // x-axis lable
        container.append("text")
            .attr("x", w/2)
            .attr("y", h + margin.bottom*.66)
            .attr("text-anchor", "middle")
            .text(xAxisTitle);

        // y-axis lable
        container.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -h / 2)
            .attr("y", -margin.left/2)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text(yAxisTitle+ " (average)");

            container.selectAll('.tick line').remove();
            container.selectAll('.domain').remove();
    }

    sortDays(day, next_day) {
        let days = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
        return days.indexOf(day) - days.indexOf(next_day)
    }

    render () {
        return (
            <svg className="bar">
                <g className="g_2"></g>
           </svg>
        )
    }
}


export default BarChart; 