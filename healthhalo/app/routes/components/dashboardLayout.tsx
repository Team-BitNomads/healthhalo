import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { generateHealthTips } from "../../data/healthTips";
import type { HealthTip } from "../../data/healthTips";
import { MessageSquare, FileText, AlertTriangle, ArrowRight, TrendingUp, Wallet, Sparkles, Activity } from "lucide-react";

const API_BASE_URL = "https://healthhalo.onrender.com";

interface ApiUserProfile {
  full_name: string;
  date_of_birth: string;
  gender: string;
  occupation: string;
  [key: string]: any;
}

const isProfileFullyFilled = (profile: ApiUserProfile | null): boolean => {
  if (!profile) return false;
  const requiredFields = ['full_name', 'date_of_birth', 'gender', 'occupation'];
  return requiredFields.every(field => profile[field] && String(profile[field]).trim() !== '');
};

const DashboardLayout = () => {
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!userName) setIsLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) { setIsLoading(false); return; }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/health-sub/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userProfile: ApiUserProfile = response.data;

      setUserName(userProfile.full_name || 'User');
      setIsProfileComplete(isProfileFullyFilled(userProfile));
      setHealthTips(generateHealthTips(userProfile as any));
      // You can add your wallet balance fetch logic here later
      setWalletBalance(parseFloat(localStorage.getItem('walletBalance') || '0'));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setIsProfileComplete(false);
        const localProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        setUserName(localProfile.fullName || 'User');
      } else {
        console.error("Failed to fetch dashboard data:", error);
      }
      setHealthTips(generateHealthTips(null));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    window.addEventListener('focus', fetchDashboardData);
    return () => { window.removeEventListener('focus', fetchDashboardData); };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 p-6 animate-fadeInUp">
      {/* Header Section with Enhanced Styling */}
      <div className="relative mb-12">
        {/* Floating Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/40 to-blue-200/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-8 left-1/4 w-16 h-16 bg-gradient-to-br from-violet-200/30 to-pink-200/30 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 text-emerald-500 mr-2 animate-pulse" />
            <p className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back,
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight leading-tight">
            {isLoading && !userName ? (
              <div className="flex items-center space-x-3">
                <div className="h-12 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                <Activity className="h-8 w-8 text-slate-400 animate-spin" />
              </div>
            ) : (
              `${userName.split(' ')[0]}'s Health Journey`
            )}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-4 animate-pulse"></div>
        </div>
      </div>

      {/* Profile Completion Banner with Enhanced Design */}
      {!isProfileComplete && !isLoading && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white p-6 rounded-2xl mb-10 shadow-2xl border border-white/20">
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 animate-pulse"></div>
          </div>
          <div className="relative flex items-center justify-between">
            <div className='flex items-center'>
              <div className="bg-white/20 p-3 rounded-xl mr-4 backdrop-blur-sm">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <p className="font-bold text-xl mb-1">Unlock Your Full Potential</p>
                <p className="opacity-90 text-sm">Complete your profile for truly personalized AI recommendations.</p>
              </div>
            </div>
            <Link 
              to="/profile_details" 
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-xl hover:bg-orange-50 transition-all duration-300 whitespace-nowrap flex items-center group shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Complete Profile 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Cards Grid with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Wallet Balance Card */}
        <Link 
          to="/wallet" 
          className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-600 group-hover:text-emerald-600 transition-colors duration-300">
                Wallet Balance
              </h3>
              <Wallet className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            {isLoading && walletBalance === null ? (
              <div className="space-y-2">
                <div className="h-9 w-3/4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                <div className="h-2 w-full bg-slate-100 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-emerald-300 to-blue-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-800 mb-3">
                  ₦ {walletBalance?.toLocaleString() || 0}
                </p>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: walletBalance && walletBalance > 0 ? '75%' : '0%' }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </Link>

        {/* AI Chat Card */}
        <Link 
          to="/chatbot" 
          className="group bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
            <div className="bg-white/20 p-3 rounded-xl mb-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <MessageSquare size={28} />
            </div>
            <p className="font-bold text-lg">Talk to AI</p>
            <p className="text-xs opacity-80 mt-1">Get instant health advice</p>
          </div>
        </Link>

        {/* Claims Card */}
        <Link 
          to="/claims" 
          className="group bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
            <div className="bg-white/20 p-3 rounded-xl mb-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <FileText size={28} />
            </div>
            <p className="font-bold text-lg">File a Claim</p>
            <p className="text-xs opacity-80 mt-1">Quick & easy process</p>
          </div>
        </Link>
      </div>

      {/* Health Focus Section with Enhanced Styling */}
      <div className="relative">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-xl mr-4 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              AI-Generated Health Focus
            </h2>
            <p className="text-slate-500 text-sm mt-1">Personalized recommendations based on your profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {healthTips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div 
                key={tip.id} 
                className="group bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                }}
              >
                {/* Hover decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100/50 to-blue-100/50 rounded-full -translate-y-8 translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex items-start space-x-4 relative z-10">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${tip.color} shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <IconComponent className="h-7 w-7 text-white relative z-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                      {tip.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                </div>
                
                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;