import React, { useEffect, useState } from 'react';
import { Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement, } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Statistic.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const Stat = () => {

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDB();
  }, []);

  const fetchDB = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
      });
      let data = await response.json();
      const siftedData = data.filter(item => item.quantity !== 0);
      if (siftedData.length === 0) {
        setAllProducts(data);
      } else {
        setAllProducts(siftedData);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setIsLoading(false);
    }
  };

  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
  const [latest, setLatest] = useState(5); // Default

  useEffect(() => {
    if (!isLoading) {
      const sortedProd = [...allProducts].sort((a, b) => b.sold - a.sold);
      const labels = sortedProd.map(item => item.prod_name);
      const data = sortedProd.map(item => item.sold);

      // Set bar chart data
      setBarChartData({
        labels: labels,
        datasets: [{
          label: 'Items Sold',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      });

      const backgroundColor = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(53, 162, 235, 0.5)',
        'rgba(181, 2, 160, 0.5)',
        'rgba(227, 223, 0, 0.5)',
        'rgba(34, 139, 34, 0.5)',
      ]
      const borderColor = [
        'rgba(255, 99, 132)',
        'rgba(53, 162, 235)',
        'rgba(181, 2, 160)',
        'rgba(227, 223, 0)',
        'rgba(34, 139, 34)',
      ]
      // Set pie chart data
      setPieChartData({
        labels: labels,
        datasets: [{
          label: 'Sold',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        }],
      });

      // Set line chart data
      const lineData = sortedProd.map(item => {
        const dataLength = item.record.length;
        return dataLength > latest ? item.record.slice(dataLength - latest, dataLength) : item.record;
      });
      const lineDataSet = [];
      for (let i = 0; i < lineData.length; i ++) {
        lineDataSet.push({
          'label': labels[i],
          'data': lineData[i],
          'backgroundColor': backgroundColor[i],
          'borderColor': borderColor[i],
          'borderWidth': 1
        });
      }
      const numbers = Array.from({ length: latest }, (_, index) => index + 1);
      setLineChartData({
        labels: numbers,
        datasets: lineDataSet
      });
    }
  }, [allProducts, isLoading, latest]);

  const optionsForBar = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.raw;
            return context.label + ' sold: ' + value;
          }
        }
      }
    }
  };

  const optionsForPie = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let total = context.dataset.data.reduce((a, b) => a + b, 0);
            let value = context.raw;
            let percentage = ((value/total) * 100).toFixed(2);
            return context.label + ': ' + percentage + '%';
          }
        }
      }
    }
  }

  const optionsForLine = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Purchased times',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Quantity',
        },
      },
    },
  };



  return (
    <div className='charts'>
      <div style={{width: "600px", height: "600px"}}>
        <h2 className='chart-title'>Total number of each product sold</h2>
        <Bar data={barChartData} options={optionsForBar}/>
      </div>
      <div style={{width: "600px", height: "600px"}}>
        <h2 className='chart-title'>Total percentage share of each item sold</h2>
        <Pie data={pieChartData} options={optionsForPie}/>
      </div>
      <div style={{width: "600px", height: "600px"}}>
        <h2 className='chart-title'>
          Recent
          <select
            value={latest}
            onChange={(e) => setLatest(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          purchases on each item</h2>
        <Line data={lineChartData} options={optionsForLine}/>
      </div>
      <Button onClick={() => navigate('/admin')}>
        Back
      </Button>
    </div>
  );
};

export default Stat;
