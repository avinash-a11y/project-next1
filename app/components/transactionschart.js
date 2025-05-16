'use client';

import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Tooltip, 
  Legend,
  BarElement,
  Filler 
} from 'chart.js';
import { getApiBaseUrl } from '../utils/api';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, BarElement, Filler);

const TransactionChart = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/transactions?user=${userId}`);
      const json = await res.json();
      setTransactions(json.transactions || []);
    };

    fetchData();
  }, [userId]);

  if (!transactions.length) {
    return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  }

  // Filter transactions based on the selected timeframe
  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate = new Date();

    switch (activeTimeframe) {
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
      default:
        startDate = new Date(0); // Beginning of time
    }

    return transactions.filter(tx => new Date(tx.createdAt) >= startDate);
  };

  const filteredTx = getFilteredTransactions();
  const sortedTx = [...filteredTx].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const labels = sortedTx.map(tx =>
    new Date(tx.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  );

  // Calculate portfolio value
  let runningTotal = 0;
  const values = sortedTx.map(tx => {
    runningTotal += tx.amount;
    return runningTotal;
  });

  // Calculate transaction volume
  const deposits = sortedTx.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const withdrawals = sortedTx.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Chart data
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: values,
        borderColor: '#7B61FF',
        backgroundColor: 'rgba(123, 97, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  // Bar chart data showing individual transactions
  const barData = {
    labels,
    datasets: [
      {
        label: 'Transaction Amount',
        data: sortedTx.map(tx => tx.amount),
        backgroundColor: sortedTx.map(tx => 
          tx.amount >= 0 ? 'rgba(46, 213, 115, 0.6)' : 'rgba(246, 71, 71, 0.6)'
        ),
        borderColor: sortedTx.map(tx => 
          tx.amount >= 0 ? 'rgb(46, 213, 115)' : 'rgb(246, 71, 71)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const tx = sortedTx[context.dataIndex];
            if (chartType === 'bar') {
              return `Amount: $${tx.amount} | Token: ${tx.token.substring(0, 10)}`;
            }
            return `Value: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `$${val}`,
        },
        grid: {
          color: '#eee',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <button 
            onClick={() => setChartType('line')}
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              chartType === 'line' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
          >
            Portfolio Value
          </button>
          <button 
            onClick={() => setChartType('bar')}
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              chartType === 'bar' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
          >
            Transactions
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {["1W", "1M", "3M", "6M", "1Y", "ALL"].map(label => (
            <button
              key={label}
              onClick={() => setActiveTimeframe(label)}
              className={`px-3 py-1 rounded-full ${
                label === activeTimeframe ? "bg-gray-200 font-semibold" : "bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        {chartType === 'line' ? (
          <Line data={lineData} options={options} />
        ) : (
          <Bar data={barData} options={options} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Total Deposits</p>
          <p className="text-2xl font-bold">${deposits.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 text-sm font-medium">Total Withdrawals</p>
          <p className="text-2xl font-bold">${withdrawals.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;
