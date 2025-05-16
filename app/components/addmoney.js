'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiBaseUrl } from '../utils/api';

const AddMoneyComponent = ({refresh, setRefresh}) => {
    
  const [amount, setAmount] = useState('');
  const { data: session } = useSession();
  const [bank, setBank] = useState('HDFC Bank');
  const [loading, setLoading] = useState(false);
  
  const handleAddMoney = async () => {
    const random = Math.random().toString(36).substring(2, 15);
    setLoading(true);
    
    try {
      const baseUrl = getApiBaseUrl();
      
      const postMoney = await axios.post(`${baseUrl}/api/addmoney`, {
          "amount": Number(amount),
          "user": Number(session?.user?.id)  
      });
      
      const addtransaction = await axios.post(`${baseUrl}/api/transactions`, {
          "amount": Number(amount),
          "user": Number(session?.user?.id),   
          "token": random + "ONRAMP" + bank
      });
      
      setRefresh(!refresh);
      console.log(postMoney);
    } catch (error) {
      console.error("Error adding money:", error);
    } finally {
      setLoading(false);
    }
  };    

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-xl font-semibold mb-4">Add Money</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Bank</label>
        <select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option>HDFC Bank</option>
          <option>SBI Bank</option>
          <option>ICICI Bank</option>
          <option>Axis Bank</option>
        </select>
      </div>
      <button
        onClick={handleAddMoney}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        {loading ? "Adding..." : "Add Money"}
      </button>
    </div>
  );
};

export default AddMoneyComponent;
