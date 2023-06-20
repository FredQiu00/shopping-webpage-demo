import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './UserHistory.css';

const UserHistory = () => {
  const params = useParams();
  const userId = params.id;

  // State to store the fetched history data
  const [historyData, setHistoryData] = useState(null);
  const [numSessions, setNumSessions] = useState(5); // Default

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the history data when the component is mounted
    const fetchHistoryData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users`);
        let users = await response.json();
        const targetUser = users.find(user => user._id === userId);
        if (targetUser) {
          setHistoryData(targetUser.bought);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Failed to fetch history data:", error);
      }
    };

    fetchHistoryData();
  }, [userId]);

  if (!historyData) {
    return <div>Loading...</div>;
  }

  if (historyData.length === 0) {
    return <div>No purchased items...</div>
  }

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, BarElement);

  const totalQuantities = historyData
    .flat()
    .reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        if (!acc[key]) {
          acc[key] = item[key];
        } else {
          acc[key] += item[key];
        }
      });
      return acc;
    }, {});

  const sortedQuantities = Object.entries(totalQuantities).sort((a, b) => b[1] - a[1]);
  const mostPurchasedItem = sortedQuantities[0][0];
  const leastPurchasedItem = sortedQuantities[sortedQuantities.length - 1][0];

  const backgroundColor = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(53, 162, 235, 0.5)',
    'rgba(181, 2, 160, 0.5)',
    'rgba(227, 223, 0, 0.5)',
    'rgba(34, 139, 34, 0.5)',
  ];
  const borderColor = [
    'rgba(255, 99, 132)',
    'rgba(53, 162, 235)',
    'rgba(181, 2, 160)',
    'rgba(227, 223, 0)',
    'rgba(34, 139, 34)',
  ];

  const doughnutData = {
    labels: Object.keys(totalQuantities),
    datasets: [
      {
        label: '# of purchases',
        data: Object.values(totalQuantities),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const sessionQuantities = historyData.map(session =>
    session.reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        if (!acc[key]) {
          acc[key] = item[key];
        } else {
          acc[key] += item[key];
        }
      });
      return acc;
    }, {})
  );

  const sessionQuantitiesSlice = sessionQuantities.length - numSessions < 0
    ? sessionQuantities
    : sessionQuantities.slice(sessionQuantities.length - numSessions);

  const barData = {
    labels: sessionQuantitiesSlice.map((_, index) => `Session ${index + 1}`),
    datasets: Object.keys(totalQuantities).map((key, i) => ({
      label: key,
      data: sessionQuantitiesSlice.map(session => session[key] || 0),
      backgroundColor: backgroundColor[i % backgroundColor.length],
      borderColor: borderColor[i % borderColor.length],
      borderWidth: 1,
    })),
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
      },
      x: {
        stacked: true,
      },
    },
    plugins: {
      layout: {
        padding: {
          bottom: 30,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    height: 600,
  };


  // Display the history data
  return (
    <div className="user-history-container">
      <h1 className="user-id">User ID: {userId}</h1>
      <div className='chart-container'>
        <div className="doughnut-container">
          <h2 className='chart-title'>Total number of each product sold</h2>
          <Doughnut data={doughnutData} />
        </div>
        <div className="stacked-bar-container">
          <h2 className="chart-title">
            Recent
            <select
              className="session-select"
              value={numSessions}
              onChange={(e) => setNumSessions(Number(e.target.value))}
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
            purchases
          </h2>
          <div className="bar-chart-container">
            <Bar data={barData} options={options} />
          </div>
        </div>
      </div>
      <div className="most-least-purchased">
          <p>Most purchased item: <strong>{mostPurchasedItem}</strong></p>
          <p>Least purchased item: <strong>{leastPurchasedItem}</strong></p>
      </div>
      <Button className='back-button' onClick={() => navigate('/admin/user')}>Back</Button>
    </div>
  );
};

export default UserHistory;
