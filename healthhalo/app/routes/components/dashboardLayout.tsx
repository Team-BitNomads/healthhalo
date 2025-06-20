import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { generateHealthTips } from "../../data/healthTips";
import type { HealthTip } from "../../data/healthTips";
import { MessageSquare, FileText, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";

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
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <p className="text-base font-medium text-emerald-600">Welcome Back,</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          {isLoading && !userName ? 'Loading...' : `${userName.split(' ')[0]}'s Health Dashboard`}
        </h1>
      </div>

      {!isProfileComplete && !isLoading && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-5 rounded-xl mb-8 flex items-center justify-between shadow-lg">
          <div className='flex items-center'>
            <AlertTriangle className="h-7 w-7 mr-4 flex-shrink-0" />
            <div><p className="font-bold text-lg">Unlock Your Full Potential</p><p className="opacity-90 text-sm">Complete your profile for personalized recommendations.</p></div>
          </div>
          <Link to="/profile_details" className="bg-white text-orange-500 font-bold py-2 px-5 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap flex items-center group text-sm">
            Complete Profile <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/wallet" className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all">
          <h3 className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">Wallet Balance</h3>
          {isLoading && walletBalance === null ? <div className="h-9 w-3/4 bg-slate-200 rounded mt-1 animate-pulse"></div> : <p className="text-3xl font-bold text-slate-800 mt-1">₦ {walletBalance?.toLocaleString() || 0}</p>}
        </Link>
        <Link to="/chatbot" className="group bg-emerald-500 text-white p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-center items-center text-center"><MessageSquare size={24} /><p className="font-bold text-base mt-2">Talk to AI</p></Link>
        <Link to="/claims" className="group bg-slate-800 text-white p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-center items-center text-center"><FileText size={24} /><p className="font-bold text-base mt-2">File a Claim</p></Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-700 mb-5 flex items-center"><TrendingUp className="mr-3 h-5 w-5 text-emerald-600" />AI-Generated Health Focus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {healthTips.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <div key={tip.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${tip.color} shadow-inner shadow-black/10`}><IconComponent className="h-6 w-6 text-white" /></div>
                <div><h3 className="font-bold text-sm text-slate-800">{tip.title}</h3><p className="text-slate-500 text-xs mt-1 leading-relaxed">{tip.text}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;