import React, {Component} from "react"
import * as d3 from "d3"

class ScatterPlot extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() { // preprocessing on long running task so it doesnt affect rendering process, in dev mode- doesnt work right, only mounts 1 time at the beginning, then updates
        // console.log(this.props.data)
    }

    componentDidUpdate() {
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 40, bottom: 30, left: 40 },
        w = 1600 - margin.left - margin.right,
        h = 400 - margin.top - margin.bottom;

        d3.select('.scatter').select('g').selectAll('*').remove();

        var { data, x, y } = this.props;
        var container = d3
        .select(".scatter")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .select(".g_1")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // X axis
        var x_data = data.map((item) => item[x]);
        var x_scale = d3
        .scaleLinear()
        .domain([0,d3.max(x_data)])
        .range([margin.left, w])

        container
        .selectAll(".x_axis_g")
        .data([0])
        .join("g")
        .attr("class", "x_axis_g")
        .attr("transform", `translate(0, ${h})`)
        .call(d3.axisBottom(x_scale));
        
        // Add Y axis
        var y_data = data.map((item) => item[y]);
        var y_scale = d3
        .scaleLinear()
        .domain([0, d3.max(y_data)])
        .range([h, 0]);

        container
        .selectAll(".y_axis_g")
        .data([0])
        .join("g")
        .attr("class", "x_axis_g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_scale));

        container
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) {
            return x_scale(d[x]);
        })
        .attr("cy", function (d) {
            return y_scale(d[y]);
        })
        .attr("r", 3)
        .attr("fill", "gray");
    }

    render () {
        return (
            <svg className="scatter">
                <g className="g_1"></g>
           </svg>
        )
    }
}


export default ScatterPlot;