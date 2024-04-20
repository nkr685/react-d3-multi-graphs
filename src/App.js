import './App.css';
import React, {Component} from "react"
import Navbar from './components/Navbar';
import Radio from './components/Radio';
import * as d3 from "d3"
import tips from "./tips.csv"
import BarChart from './graphs/BarChart';
import ScatterPlot from './graphs/ScatterPlot';
import CorrelationMatrix from './graphs/CorrelationMatrix';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {data:[], numCols:[], catCols:[], radioOption:"None", dropdownOption:"None", matrixX:"None", matrixY:"None"};
    }

    componentDidMount() {
        var self=this;
        d3.csv(tips, function(d) {
            return {
                total_bill:parseFloat(d.total_bill),
                tip:parseFloat(d.tip),
                sex:d.sex,
                smoker:d.smoker,
                day:d.day,
                time:d.time,
                size:parseFloat(d.size)
            }})
        .then(function(csv_data){
            let tempNumCols = ['total_bill', 'tip', 'size']
            let tempCatCols = ['sex', 'smoker', 'day', 'time']
            self.setState({data:csv_data, numCols:tempNumCols, catCols:tempCatCols, radioOption:tempCatCols[0], dropdownOption: tempNumCols[0], matrixX: tempNumCols[0], matrixY: tempNumCols[1]})
        })
        .catch(function(err) {
            console.log(err)
        });
    }

    render () {

        const handleRadio = (e) => {
            console.log(e.target.value)
            this.setState({radioOption:e.target.value})
        }

        const handleDropdown = (e) => {
            console.log(e.target.value)
            this.setState({dropdownOption:e.target.value})
        }

        const handleMatrix = (e, d) => {
            this.setState({matrixX: d.x, matrixY: d.y})
        }

        return (
            <div className='container'>
                <Navbar defaultValue={this.state.dropdownOption} options={this.state.numCols} handleChange={handleDropdown}/>
                <div className='row1'>
                    <div className='row-items'>
                        <div className='graph-container'>
                            <Radio defaultValue={this.state.radioOption} options={this.state.catCols} handleChange={handleRadio}/>
                            <BarChart x={this.state.radioOption} y={this.state.dropdownOption} data={this.state.data}/>                                
                        </div>
                        <div className='graph-container'>
                            <div>Correlation Matrix</div>
                            <CorrelationMatrix axes={this.state.numCols} data={this.state.data} handleChange={handleMatrix}/>
                        </div>                        
                    </div>
                </div>
                <div className='row2'>
                    <div className='graph-container'>
                        <ScatterPlot x={this.state.matrixX} y={this.state.matrixY} data={this.state.data}/>
                    </div>
                </div>
            </div>
        )
    };
}

export default App;
