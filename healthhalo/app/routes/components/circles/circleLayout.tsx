import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, ShieldCheck, TrendingUp, Info } from 'lucide-react';

// Mock data based on your PRD
const mockCircles = [
  { id: 1, name: "Adetola Family Circle", members: 5, balance: 75000, contribution: 5000, status: 'healthy' },
  { id: 2, name: "Ikeja Coders Group", members: 12, balance: 180000, contribution: 2500, status: 'healthy' },
  { id: 3, name: "Community Savings", members: 8, balance: 45000, contribution: 1000, status: 'low' },
];

const CirclesLayout = () => {
  return (
    <div className="animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">HealthHalo Circles</h1>
          <p className="text-slate-500 mt-2 text-lg">Your trusted groups for community health insurance.</p>
        </div>
        <Link to="/circles/create" className="mt-4 md:mt-0 w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center">
          <Plus className="mr-2 h-5 w-5" /> Create a New Circle
        </Link>
      </div>

      {/* "How it Works" Info Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60 mb-8">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-3"><Info className="mr-2 text-emerald-600" />How HealthHalo Circles Works</h3>
          <p className="text-slate-600">HealthHalo Circles allows you and a trusted group (family, friends, colleagues) to pool small, regular contributions into a shared health wallet. This collective fund can then be used by any member to pay for medical claims, ensuring everyone is covered without the burden of large individual premiums.</p>
      </div>
      
      {/* List of User's Circles */}
      <div className="space-y-6">
        {mockCircles.map(circle => (
          <div key={circle.id} className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{circle.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center"><Users className="h-4 w-4 mr-1.5" /> {circle.members} Members</span>
                        <span className={`flex items-center font-semibold ${circle.status === 'healthy' ? 'text-green-600' : 'text-orange-500'}`}>
                            <ShieldCheck className="h-4 w-4 mr-1.5" /> Pool Status: {circle.status.charAt(0).toUpperCase() + circle.status.slice(1)}
                        </span>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <p className="text-sm text-slate-500">Circle Balance</p>
                    <p className="text-3xl font-bold text-emerald-600">₦{circle.balance.toLocaleString()}</p>
                </div>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500">Your Contribution</p>
                    <p className="font-semibold text-slate-700">₦{circle.contribution.toLocaleString()} / week</p>
                </div>
                <Link to={`/circles/${circle.id}`} className="bg-slate-800 text-white py-2 px-5 rounded-lg font-semibold hover:bg-slate-700 transition-colors">
                    View Circle
                </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CirclesLayout;