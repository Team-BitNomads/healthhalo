import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WelcomeModal from "./welcomeModal";
import { generateHealthTips } from "../../data/healthTips";
import type { UserProfile, HealthTip } from "../../data/healthTips";
import {
  Lightbulb,
  MessageSquare,
  Wallet,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// --- HELPER FUNCTION TO CHECK PROFILE COMPLETENESS ---
// This function makes the logic clean and easy to update.
const isProfileFullyFilled = (profile: UserProfile | null): boolean => {
  if (!profile) {
    return false; // If there's no profile, it's not complete.
  }

  // List of essential fields that must have a value.
  const requiredFields: (keyof UserProfile)[] = [
    'fullName',
    'dob',
    'gender',
    'activityLevel'
  ];

  // The 'every' method checks if ALL fields in the list have a non-empty value.
  return requiredFields.every(field => profile[field] && profile[field] !== '');
};


const DashboardLayout = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userName, setUserName] = useState<string>('User');

  useEffect(() => {
    const isNew = localStorage.getItem("isNewUser");
    if (isNew === "true") {
      setShowWelcomeModal(true);
      localStorage.removeItem("isNewUser");
    }

    const savedProfileString = localStorage.getItem("userProfile");
    const userProfile: UserProfile | null = savedProfileString ? JSON.parse(savedProfileString) : null;

    // --- DYNAMIC PROFILE CHECK ---
    // We now use our new helper function for a much more accurate check.
    setIsProfileComplete(isProfileFullyFilled(userProfile));

    if (userProfile?.fullName) {
      setUserName(userProfile.fullName.split(' ')[0]);
    }

    setHealthTips(generateHealthTips(userProfile));
  }, []);

  return (
    <div className="animate-fadeInUp">
      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
      
      <div className="mb-8">
        <p className="text-base font-medium text-emerald-600">Welcome Back,</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{userName}'s Health Dashboard</h1>
      </div>

      {/* This banner will now only show if the profile is truly incomplete. */}
      {!isProfileComplete && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-5 rounded-xl mb-8 flex items-center justify-between shadow-lg">
          <div className='flex items-center'>
            <AlertTriangle className="h-7 w-7 mr-4 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Unlock Your Full Potential</p>
              <p className="opacity-90 text-sm">Complete your profile for truly personalized recommendations.</p>
            </div>
          </div>
          <Link to="/profile_details" className="bg-white text-orange-500 font-bold py-2 px-5 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap flex items-center group text-sm">
            Complete Profile <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* --- "Active Plan" card has been REMOVED and grid updated --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/wallet" className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all">
          <h3 className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">Wallet Balance</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">₦ 15,250</p>
        </Link>
        
        <Link to="/chatbot" className="group bg-emerald-500 text-white p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-center items-center text-center">
          <MessageSquare size={24} />
          <p className="font-bold text-base mt-2">Talk to AI</p>
        </Link>
        
        <Link to="/claims" className="group bg-slate-800 text-white p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-center items-center text-center">
          <FileText size={24} />
          <p className="font-bold text-base mt-2">File a Claim</p>
        </Link>
      </div>

      {/* Health Focus Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-700 mb-5 flex items-center">
          <TrendingUp className="mr-3 h-5 w-5 text-emerald-600" />
          AI-Generated Health Focus
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {healthTips.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <div key={tip.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${tip.color} shadow-inner shadow-black/10`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{tip.title}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{tip.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;