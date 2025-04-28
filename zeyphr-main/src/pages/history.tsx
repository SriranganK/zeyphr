import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import Navbar from "@/components/navbar";

// Dummy Transactions
const transactions = [
  {
    id: 1,
    name: "Kiran",
    amount: 10,
    type: "debit",
    date: new Date("2024-04-10T16:52:00"),
    initial: "K",
  },
  {
    id: 2,
    name: "Mukesh Agarwal",
    amount: 110,
    type: "debit",
    date: new Date("2024-04-09T21:32:00"),
    initial: "M",
  },
  {
    id: 3,
    name: "Sanchit Petro",
    amount: 150,
    type: "debit",
    date: new Date("2024-04-09T21:27:00"),
    initial: "S",
  },
  {
    id: 4,
    name: "Freelance Work",
    amount: 500,
    type: "credit",
    date: new Date("2024-04-08T18:00:00"),
    initial: "F",
  },
];

// Format date for transactions
const formatTransactionDate = (date:any) => {
  return format(date, "dd MMM yyyy, hh:mm a");
};

const TransactionHistory = () => {
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((tx) =>
    tx.name.toLowerCase().includes(search.toLowerCase())
  );

  const monthData = [
    { month: "Jan", amount: 0 },
    { month: "Feb", amount: 0 },
    { month: "Mar", amount: 0 },
    { month: "Apr", amount: 0 },
    { month: "May", amount: 0 },
    { month: "Jun", amount: 0 },
    { month: "Jul", amount: 0 },
    { month: "Aug", amount: 0 },
    { month: "Sep", amount: 0 },
    { month: "Oct", amount: 0 },
    { month: "Nov", amount: 0 },
    { month: "Dec", amount: 0 },
  ];

  transactions.forEach((tx) => {
    const monthIndex = tx.date.getMonth();
    if (tx.type === "credit") {
      monthData[monthIndex].amount += tx.amount;
    } else {
      monthData[monthIndex].amount -= tx.amount;
    }
  });

  return (

    <div
      style={{
        maxWidth: "90%",
        margin: "0 auto",
        padding: "20px",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* Analytics DisplayCards */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <DisplayCard
          title="Total Expenses"
          amount={`₹${transactions
            .filter((t) => t.type === "debit")
            .reduce((a, b) => a + b.amount, 0)}`}
        />
        <DisplayCard
          title="Total Income"
          amount={`₹${transactions
            .filter((t) => t.type === "credit")
            .reduce((a, b) => a + b.amount, 0)}`}
        />
        <DisplayCard
          title="Net"
          amount={`₹${
            transactions
              .filter((t) => t.type === "credit")
              .reduce((a, b) => a + b.amount, 0) -
            transactions
              .filter((t) => t.type === "debit")
              .reduce((a, b) => a + b.amount, 0)
          }`}
        />
      </div>

      {/* Line Chart */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Monthly Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction History Title + Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2>Transaction History</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            minWidth: "200px",
          }}
        />
      </div>

      {/* Transaction List */}
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {filtered.map((tx) => (
          <div
            key={tx.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {tx.initial}
              </div>
              <div>
                <div style={{ fontWeight: "600" }}>{tx.name}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {formatTransactionDate(tx.date)}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "600" }}>
                {tx.type === "debit" ? "-" : "+"}₹{tx.amount}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: tx.type === "debit" ? "red" : "green",
                }}
              >
                {tx.type.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}
          >
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

const DisplayCard = ({ title, amount }:any) => (
  <div
    style={{
      background: "white",
      padding: "16px",
      borderRadius: "8px",
      flex: "1",
      minWidth: "200px",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <div style={{ fontSize: "16px", color: "#6b7280", marginBottom: "8px" }}>
      {title}
    </div>
    <div style={{ fontSize: "24px", fontWeight: "bold" }}>{amount}</div>
  </div>
);

export default TransactionHistory;
