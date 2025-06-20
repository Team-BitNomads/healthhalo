import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar';
import { ArrowLeft, Users, ShieldCheck, DollarSign, FileText } from 'lucide-react';

// This is a simple layout for the detail page content
const CircleDetailLayout = () => {
    const { circleId } = useParams();
    // In a real app, you would fetch the details for this circleId from your API
    
    return (
        <div className="animate-fadeInUp">
            <Link to="/circles" className="flex items-center text-slate-600 hover:text-slate-900 mb-6 font-semibold">
                <ArrowLeft size={20} className="mr-2"/> Back to All Circles
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Adetola Family Circle</h1>
            <p className="text-slate-500 mt-2 text-lg">Circle ID: {circleId}</p>

            <div className="mt-8 p-8 bg-white rounded-2xl shadow-lg border">
                <h2 className="text-2xl font-bold text-emerald-700">You are now a member!</h2>
                <p className="text-slate-600 mt-2">Your first contribution has been made. You can now file claims, view member activity, and see the circle's full transaction history.</p>
                <div className="mt-6 flex gap-4">
                    <button className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"><DollarSign size={18}/> Make Extra Contribution</button>
                    <button className="bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"><FileText size={18}/> File a Claim</button>
                </div>
            </div>
        </div>
    );
};


// This is the full page component that includes the sidebar and header
const CircleDetailPage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-100">
      <div className={`relative hidden lg:block flex-shrink-0 ... ${isDesktopSidebarCollapsed ? 'w-24' : 'w-72'}`}>
        <Sidebar currentPath={location.pathname} isCollapsed={isDesktopSidebarCollapsed} onToggleCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)} />
      </div>
      <div className={`fixed inset-0 z-40 lg:hidden ...`}>{/* Mobile Drawer Logic */}</div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/95 ...">{/* Header JSX */}</header>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <CircleDetailLayout />
        </main>
      </div>
    </div>
  );
};

export default CircleDetailPage;