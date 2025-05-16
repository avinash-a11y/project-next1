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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use relative URL for better reliability
        const response = await fetch(`/api/transactions?user=${userId}`);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const json = await response.json();
        
        if (!json.transactions) {
          console.warn('Transaction data format unexpected:', json);
          setTransactions([]);
        } else {
          setTransactions(json.transactions || []);
        }
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError(err.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError('No user ID provided');
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
        <span>Loading chart data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <div className="bg-red-50 p-4 rounded-lg w-full text-center">
          <p className="font-medium">Unable to load chart data</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
          <p className="text-xs mt-3">Try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-4 text-center w-full">
          <p className="text-gray-500">No transaction data available</p>
          <p className="text-sm text-gray-400 mt-1">Make some transactions to see your activity here</p>
        </div>
      </div>
    );
  }

  // Filter transactions based on the selected timeframe
  const getFilteredTransactions = () => {
    try {
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
    } catch (err) {
      console.error('Error filtering transactions:', err);
      return [];
    }
  };

  let filteredTx = [];
  let sortedTx = [];
  let labels = [];
  let values = [];
  let deposits = 0;
  let withdrawals = 0;

  try {
    filteredTx = getFilteredTransactions();
    sortedTx = [...filteredTx].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  
    labels = sortedTx.map(tx =>
      new Date(tx.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    );
  
    // Calculate portfolio value
    let runningTotal = 0;
    values = sortedTx.map(tx => {
      runningTotal += tx.amount;
      return runningTotal;
    });
  
    // Calculate transaction volume
    deposits = sortedTx.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    withdrawals = sortedTx.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  } catch (err) {
    console.error('Error processing transaction data:', err);
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <div className="bg-red-50 p-4 rounded-lg w-full text-center">
          <p className="font-medium">Error processing transactions</p>
          <p className="text-sm text-red-400 mt-1">{err.message}</p>
        </div>
      </div>
    );
  }

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
            try {
              const tx = sortedTx[context.dataIndex];
              if (chartType === 'bar') {
                return `Amount: $${tx.amount} | Token: ${tx.token.substring(0, 10)}`;
              }
              return `Value: $${context.raw.toFixed(2)}`;
            } catch (err) {
              return 'Error displaying value';
            }
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
