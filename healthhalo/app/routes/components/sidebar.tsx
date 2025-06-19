import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  MessageSquare, 
  FileText, 
  UserCircle, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children, isActive, isCollapsed, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group relative flex items-center px-3.5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
      isActive 
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25' 
        : 'text-slate-700 hover:bg-emerald-50'
    } ${isCollapsed ? 'justify-center' : ''}`}
  >
    <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
      isActive 
        ? 'bg-white/20 text-white' 
        : `bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600`
    }`}>
      {icon}
    </div>
    <span className={`font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 ml-0 opacity-0' : 'w-auto ml-4 opacity-100'}`}>
        {children}
    </span>
    {isActive && !isCollapsed && (
      <ChevronRight className="ml-auto h-4 w-4 text-white/80" />
    )}
  </Link>
);

interface SidebarProps {
  currentPath: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, isCollapsed, onToggleCollapse, onLinkClick }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    console.log("User logged out");
    navigate('/');
  };

  const navLinks = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { to: "/chatbot", icon: <MessageSquare className="h-5 w-5" />, label: "AI Assistant" },
    { to: "/wallet", icon: <Wallet className="h-5 w-5" />, label: "Health Wallet" },
    { to: "/claims", icon: <FileText className="h-5 w-5" />, label: "My Claims" },
    { to: "/profile_details", icon: <UserCircle className="h-5 w-5" />, label: "Profile" },
  ];

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-white via-slate-50/50 to-white p-4 border-r border-slate-200/60 backdrop-blur-sm transition-all duration-300">
      
      <button 
        onClick={onToggleCollapse}
        className="absolute -right-3 top-14 z-10 p-1.5 bg-white border border-slate-200 rounded-full shadow-md text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-all"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className={`flex items-center mb-12 transition-all duration-300 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto ml-4 opacity-100'}`}>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">HealthHalo</span>
          <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1"></div>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        <div className={`px-3 py-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Menu</p>
        </div>
        {navLinks.map((link) => (
          <SidebarLink
            key={link.label}
            to={link.to}
            icon={link.icon}
            isActive={currentPath === link.to}
            isCollapsed={isCollapsed}
            onClick={onLinkClick}
          >
            {link.label}
          </SidebarLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className={`group flex items-center w-full px-3.5 py-3.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 border border-transparent hover:border-red-200/50 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-300">
            <LogOut className="h-5 w-5" />
          </div>
          <span className={`font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? 'w-0 ml-0 opacity-0' : 'w-auto ml-4 opacity-100'
          }`}>
              Log Out
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;