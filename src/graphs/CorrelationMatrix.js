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
        var { data, axes, handleChange} = this.props;

        var margin = { top: 10, right: 100, bottom: 50, left: 50 };
        var legendSpacing = 20;
        var legendWidth = 50;
        var w = (this.props.width/2) - margin.left - margin.right - legendSpacing - legendWidth;
        var h = (this.props.height*.45) - margin.top - margin.bottom;

        var sequentialScale = d3.scaleSequential(d3.interpolateInferno).domain([0.4, 1]);

        var filteredData = data.map(row => {
            var rows = {};
            axes.forEach(column => {
                rows[column] = row[column]
                
            });
            return rows
        })

        var columns = axes.map(column => {
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
        .attr("width", w + margin.left + margin.right + legendSpacing + legendWidth)
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

        var legend = container.append("g")
        .attr("transform", `translate(${w + legendSpacing}, 0)`)

        // gradient for color bar
        var grad = legend.append("defs")
            .append("linearGradient")
            .attr("id", "legend-gradient")
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '100%')
            .attr('y2', '0%');

        var intervals = 10
        for (let i = 0; i < intervals; i++) {
            grad.append("stop")
                .attr("offset", i*10+'%')
                .attr("stop-color", sequentialScale(0.5+(i*(.5/intervals))));
        }

        legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", h)
        .style("fill", "url(#legend-gradient)")

        // legend
        var legend_scale = d3
        .scaleLinear()
        .domain([0.5, 1])
        .range([h, 0]);

        var legend_ticks = d3.range(.5, 1.1, .1)

        container
        .selectAll(".legend_axis_g")
        .data([0])
        .join("g")
        .attr("class", "legend_axis_g")
        .attr("transform", `translate(${w + legendSpacing + legendWidth}, 0)`)
        .call(d3.axisRight(legend_scale).tickValues(legend_ticks));

        container.selectAll('.tick line').remove();
        container.selectAll('.domain').remove();
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