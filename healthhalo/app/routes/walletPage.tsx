import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import WalletLayout from './components/walletLayout'; // The content block
import { Bell, Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Health Wallet | HealthHalo" },
  { name: "description", content: "Your HealthHalo Wallet" },
];

const WalletPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar logic remains the same */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <Sidebar
          currentPath={location.pathname}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </div>
      <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-72 h-full">
          <Sidebar
            currentPath={location.pathname}
            isCollapsed={false}
            onToggleCollapse={() => {}}
            onLinkClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className="fixed inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)}></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden mr-4 text-slate-600"><Menu /></button>
            <h1 className="text-xl font-bold text-slate-800">Health Wallet</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"/></div>
            <button className="p-2 rounded-full text-slate-500 hover:bg-slate-200"><Bell /></button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <WalletLayout />
        </main>
      </div>
    </div>
  );
};

export default WalletPage;