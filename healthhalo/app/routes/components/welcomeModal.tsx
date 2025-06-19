import React from 'react';
import { Link } from 'react-router-dom';
import { PartyPopper, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center m-4 transform animate-[scaleUp_0.4s_ease-in-out_forwards]">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-6 -mt-20 shadow-lg">
          <PartyPopper className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Welcome to HealthHalo!
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Your account has been created successfully. Let's set up your profile to find the best health plans for you.
        </p>
        <div className="mt-8">
          <Link
            to="/profile_details"
            onClick={onClose}
            className="w-full inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-xl font-semibold text-base transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/25 group"
          >
            <span className="flex items-center justify-center">
              Complete My Profile
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;