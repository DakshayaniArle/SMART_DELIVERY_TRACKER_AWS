// components/Header.jsx
import React from "react";

const Header = ({ onShowOrders }) => {
  return (
    <header className="bg-blue-700 text-white flex justify-between items-center px-8 py-4 shadow relative">
      <img
        src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
        alt="logo"
        className="w-14 h-14"
      />
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
        Smart Delivery Tracker
      </h1>
      <div className="flex gap-6 text-lg">
        <button className="hover:underline">Login</button>
        <button className="hover:underline" onClick={onShowOrders}>Orders</button>
        <button className="hover:underline">Account Details</button>
      </div>
      
    </header>
  );
};

export default Header;
