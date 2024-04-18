import React, {Component} from "react"
import * as d3 from "d3"
import { corr } from 'mathjs'

class CorrelationMatrix extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() { // preprocessing on long running task so it doesnt affect rendering process, in dev mode- doesnt work right, only mounts 1 time at the beginning, then updates
        // console.log(this.props.data)
    }

    componentDidUpdate() { // preprocessing on long running task so it doesnt affect rendering process
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 40, bottom: 30, left: 40 }
        var legendWidth = 50;
        var w = 600 - margin.left - margin.right - legendWidth
        var h = 400 - margin.top - margin.bottom;

        var sequentialScale = d3.scaleSequential(d3.interpolateInferno).domain([0.4, 1]);


        var { data, axes, handleChange } = this.props;
        var filteredData = data.map(row => {
            var rows = {};
            axes.forEach(column => {
                rows[column] = row[column]
                
            });
            return rows
        })

        var columns = axes.map(column => {
            console.log(column)
            return filteredData.map(row => row[column])
        })

        var matrix = []
        for (let i=0; i < columns.length; i++) {
            for (let j=0; j < columns.length; j++) {
                matrix.push({x:axes[i], y:axes[j], r:corr(columns[i], columns[j])})                
            }
        }


        d3.select('.corr').select('g').selectAll('*').remove();
        
        var container = d3
        .select(".corr")
        .attr("width", w + margin.left + margin.right + legendWidth)
        .attr("height", h + margin.top + margin.bottom)
        .select(".g_3")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // X axis
        var x_scale = d3
        .scaleBand()
        .domain(axes)
        .range([margin.left, w]);

        container
        .selectAll(".x_axis_g")
        .data([0])
        .join("g")
        .attr("class", "x_axis_g")
        .attr("transform", `translate(0, ${h})`)
        .call(d3.axisBottom(x_scale));

        var y_scale = d3
        .scaleBand()
        .domain(axes)
        .range([h, 0]);

        container
        .selectAll(".y_axis_g")
        .data([0])
        .join("g")
        .attr("class", "y_axis_g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y_scale));

        container
        .selectAll("rect")
        .data(matrix)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x_scale(d.x);
        })
        .attr("y", function (d) {
            return y_scale(d.y);
        })
        .attr("width", x_scale.bandwidth())
        .attr("height", y_scale.bandwidth())
        .style("fill", function (d) {
            return sequentialScale(d.r);
        })
        .on('click', handleChange)
        .each(function(rect_data) {
                d3.select(this.parentNode)
                .append("text")
                .attr("x", x_scale(rect_data.x) + x_scale.bandwidth()/2)
                .attr("y", y_scale(rect_data.y) + y_scale.bandwidth()/2)
                .attr('text-anchor', "middle")
                .style("fill", "black")
                .text(rect_data.r.toFixed(2))
                .on('click', function() {handleChange(null, rect_data)});   
            }      
        );

        var legend = container.append("svg")
        .attr("transform", `translate(${w + legendWidth}, 0)`)

        legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", h)
        .style("fill", "green")

    }
    render () {
        return (
            <svg className="corr">
                <g className="g_3"></g>
           </svg>
        )
    }
}


export default CorrelationMatrix; 