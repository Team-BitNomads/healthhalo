import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // For making API calls
import { getCookie } from "../../utils/getCookie"; // Your cookie helper
import {
  LayoutDashboard,
  Wallet,
  MessageSquare,
  Users,
  FileText,
  UserCircle,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  X,
  Loader,
} from "lucide-react";

const API_BASE_URL = "https://healthhalo.onrender.com";

// --- Reusable Logout Confirmation Modal ---
interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}
const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full m-4 transform animate-[scaleUp_0.4s_ease-in-out_forwards]">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mb-5 shadow-lg">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          Confirm Log Out
        </h2>
        <p className="mt-2 text-center text-slate-500">
          Are you sure you want to log out of your HealthHalo account?
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-red-400"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              "Log Out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reusable SidebarLink Component ---
type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
};
const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  children,
  isActive,
  isCollapsed,
  onClick,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group relative flex items-center px-3.5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
      isActive
        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25"
        : "text-slate-700 hover:bg-emerald-50"
    } ${isCollapsed ? "justify-center" : ""}`}
  >
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-white/20 text-white"
          : `bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600`
      }`}
    >
      {icon}
    </div>
    <span
      className={`font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ${
        isCollapsed ? "w-0 ml-0 opacity-0" : "w-auto ml-4 opacity-100"
      }`}
    >
      {children}
    </span>
    {isActive && !isCollapsed && (
      <ChevronRight className="ml-auto h-4 w-4 text-white/80" />
    )}
  </Link>
);

// --- The Main Sidebar Component ---
interface SidebarProps {
  currentPath: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  isCollapsed,
  onToggleCollapse,
  onLinkClick,
}) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/user-auth/logout/`,
        {},
        {
          headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
          withCredentials: true,
        }
      );
      console.log("Backend logout successful.");
    } catch (error) {
      console.error(
        "Backend logout failed, but proceeding with frontend cleanup:",
        error
      );
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("isNewUser"); // Also clear this flag
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      navigate("/");
    }
  };

  const navLinks = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/circles",
      icon: <Users className="h-5 w-5" />,
      label: "Halo Circles",
    },
    {
      to: "/chatbot",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "AI Assistant",
    },
    {
      to: "/wallet",
      icon: <Wallet className="h-5 w-5" />,
      label: "Health Wallet",
    },
    {
      to: "/profile_details",
      icon: <UserCircle className="h-5 w-5" />,
      label: "Profile",
    },
  ];

  return (
    <>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />

      <div className="relative flex flex-col h-full bg-gradient-to-b from-white via-slate-50/50 to-white p-4 border-r border-slate-200/60 backdrop-blur-sm transition-all duration-300">
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-14 z-30 p-1.5 bg-white border border-slate-200 rounded-full shadow-md text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div
          className={`flex items-center mb-12 transition-all duration-300 ${
            isCollapsed ? "px-1" : "px-2"
          }`}
        >
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto ml-4 opacity-100"
            }`}
          >
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              HealthHalo
            </span>
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1"></div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <div
            className={`px-3 py-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Main Menu
            </p>
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
            onClick={() => setIsLogoutModalOpen(true)}
            className={`group flex items-center w-full px-3.5 py-3.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 border border-transparent hover:border-red-200/50 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-300">
              <LogOut className="h-5 w-5" />
            </div>
            <span
              className={`font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "w-0 ml-0 opacity-0" : "w-auto ml-4 opacity-100"
              }`}
            >
              Log Out
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
