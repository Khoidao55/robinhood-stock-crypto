import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const LineGraph = () => {
  const [graphData , setGraphData] = useState([]);

  // const createMockData = () => {
  //   let data = [];
  //   let value = 50;
  //   for(let i = 0; i < 366; i++) {
  //     var today = new Date();
  //     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //     value += Math.round((Math.random() < 0.5 ? 1 : 0) * Math.random() * 10);
  //     data.push({x: time, y: value});
  //   }
  // }
  const fetchData = async () => {
    try {
      let liveData = await axios.get('/liveData');
      console.log(liveData);
      let dataArr = liveData.data.data;
      dataArr.forEach(data => {
        // let date = new Date(data.t * 1000);
        // let hours = date.getHours();
        // let minutes = "0" + date.getMinutes();
        // let seconds = "0" + date.getSeconds();
        // let formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
        // console.log(formattedTime);
        var d = new Date();
        var n = d.toLocaleTimeString();
        setGraphData(prevData => [...prevData, {x:n, y:data.p}]);
      })
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchData();
    const interval=setInterval(()=>{
      fetchData()
     },1000)


     return()=>clearInterval(interval)
  }, []);

  console.log(graphData);
  return (
    <div style={{backgroundColor: 'black'}}>
      <h1>Breh </h1>
      <Line
        data={{
          datasets: [
            {
              type: "line",
              data: graphData,
              backgroundColor: "black",
              borderColor: "#5AC53B",
              borderWidth: 2,
              pointBorderColor: 'rgba(0, 0, 0, 0)',
              pointBackgroundColor: 'rgba(0, 0, 0, 0)',
              pointHoverBackgroundColor: '#5AC53B',
              pointHoverBorderColor: '#000000',
              pointHoverBorderWidth: 4,
              pointHoverRadius: 6
            }
          ]
        }}
        options={{
          legend: {
            display: false
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                format: 'h:mm:ss a',
                tooltipFormat: "ll",
              },
              ticks: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                display: false
              }
            }]
          }
        }}
      />
    </div>
  )
}

export default LineGraph;