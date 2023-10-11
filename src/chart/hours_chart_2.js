var hours_chart = {
    // 要创建的图表类型
    type: 'line',
    // 数据集
    data: {
        labels:['未知','未知'],
        datasets: [
            {
                label: "温度",
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgba(250, 84, 28, 0.6)',
                data: [{x: '0' ,y: 16 },{x: '2' ,y: 17 },{x:  '4',y: 18 },{x: '6' ,y: 20 },{x: '8' ,y: 24 },{x: '10' ,y: 30 },{x:  '12',y: 37 },{x: '14' ,y: 39 },{x: '16' ,y: 38 },{x: '18' ,y:34  },{x: '20' ,y: 30 },{x: '22' ,y: 27 },{x: '24' ,y: 24.5 },{x: '26' ,y: 21 },{x: '28' ,y: 18.5 },{x: '30' ,y: 18 }]//{ x: "2022/12/20", y: 0 }, { x: "2022/12/22", y: 12 }, { x: "2022/12/23", y: 9 }
            },
            {
                label: "湿度",
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgba(36, 138, 222, 0.6)',
                yAxisID: 'y3',
                data: [{x: '0' ,y: 41 },{x: '2' ,y: 40 },{x:  '4',y: 40 },{x: '6' ,y: 44 },{x: '8' ,y: 51 },{x: '10' ,y: 63 },{x:  '12',y: 77 },{x: '14' ,y: 79 },{x: '16' ,y:77  },{x: '18' ,y: 75 },{x: '20' ,y: 73 },{x: '22' ,y: 68 },{x: '24' ,y: 61 },{x: '26' ,y: 58 },{x: '28' ,y: 52 },{x: '30' ,y: 46 }]//{ x: "2022/12/20", y: -1 }, { x: "2022/12/22", y: -2 }, { x: "2022/12/23", y: 2 }
            }
        ],
    },
    // 配置选项
    options: {
        maintainAspectRatio: false,
        scales: {
            // x: {
            //     type: 'time',
            //     // time: {
            //     //   // Luxon format string
            //     //   tooltipFormat: 'DD T'
            //     // },
            //     // title: {
            //     //   display: true,
            //     //   text: 'Date'
            //     // }
            //   },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: false,
                position: 'right',
            },
            y2: {
                type: 'linear',
                display: false,
                position: 'right',
            },
            y3: {
                type: 'linear',
                position: 'right',
            },
            y4: {
                type: 'linear',
                display: false,
                position: 'right',
            }
        },
        plugins:{
            legend: {
                //display: false,
                //align:'start',
                //legendItems:[{hidden:'true'}]
              }
        }
        
    }
}
export default hours_chart