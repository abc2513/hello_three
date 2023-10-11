import React, { Component } from 'react'
import Chart from 'chart.js/auto';
import hours_chart from '../chart/hours_chart_2'
var ctx;
var dataChart;
export default class HoursReport extends Component {
    render() {
        return (
            <div className="chart-content">
                <canvas id="hours_chart"></canvas>
            </div>
        )
    }
    // UNSAFE_componentWillReceiveProps(props) {
    //     if(props.hours_report){
    //         var daily = props.hours_report.hourly;
    //     console.log(daily);
    //     if (daily && daily != []) {
    //         dataChart.data.datasets[0].data = [];
    //         dataChart.data.datasets[1].data = [];
    //         dataChart.data.datasets[2].data = [];
    //         dataChart.data.datasets[3].data = []
    //         dataChart.data.label = []
    //         dataChart.data.datasets[0].data = daily.map((item) => { return item.temp })
    //         dataChart.data.datasets[2].data = daily.map((item) => { return item.windSpeed })
    //         dataChart.data.datasets[3].data = daily.map((item) => { return item.cloud || 0})
    //         dataChart.data.datasets[1].data = daily.map((item) => { return item.humidity || 0})
    //         dataChart.data.labels = daily.map((item) => item.fxTime.slice(11,13)+'时')
    //         dataChart.update();
    //     }
    //     }
        
    // }
    componentDidMount() {
        ctx = document.getElementById('hours_chart').getContext('2d')
        dataChart = new Chart(ctx, hours_chart)
        
    }
}
