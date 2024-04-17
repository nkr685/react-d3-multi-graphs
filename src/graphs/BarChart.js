import React, {Component} from "react"
import * as d3 from "d3"

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() { // preprocessing on long running task so it doesnt affect rendering process, in dev mode- doesnt work right, only mounts 1 time at the beginning, then updates
        // console.log(this.props.data)
    }

    componentDidUpdate() { // preprocessing on long running task so it doesnt affect rendering process
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 40, bottom: 30, left: 40 },
        w = 600 - margin.left - margin.right,
        h = 400 - margin.top - margin.bottom;

        var data = this.props.data;
        var x = this.props.x;
        var y = this.props.y;

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

        // X axis
        var x_data = temp_data.map((item) => item[0]);
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
        var y_scale = d3
        .scaleLinear()
        .domain([0, d3.max(y_data)])
        .range([h, 0]);

        container
        .selectAll(".y_axis_g")
        .data([0])
        .join("g")
        .attr("class", "y_axis_g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_scale));

        container
        .selectAll("rect")
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