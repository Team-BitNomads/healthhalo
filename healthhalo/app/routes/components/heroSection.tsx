import React, { useState, useEffect } from 'react';
import AuthForm from './authForm'; // Make sure this path is correct
import { Sparkles, Heart, Shield, Users } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      text: "AI-powered recommendations",
      delay: "0ms"
    },
    {
      icon: <Users className="h-6 w-6" />,
      text: "Chat in your local language",
      delay: "200ms"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      text: "Easy payments via Mobile Money",
      delay: "400ms"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-100/30 to-cyan-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-100/10 to-teal-100/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className={`absolute top-20 left-20 h-8 w-8 text-emerald-300/40 transition-all duration-1000 ${animationPhase === 0 ? 'animate-bounce' : ''}`} />
        <Shield className={`absolute top-40 right-32 h-6 w-6 text-teal-300/40 transition-all duration-1000 ${animationPhase === 1 ? 'animate-pulse' : ''}`} />
        <Sparkles className={`absolute bottom-32 left-16 h-7 w-7 text-emerald-400/40 transition-all duration-1000 ${animationPhase === 2 ? 'animate-spin' : ''}`} />
        <Users className={`absolute bottom-20 right-20 h-6 w-6 text-cyan-300/40 transition-all duration-1000 ${animationPhase === 0 ? 'animate-pulse' : ''}`} />
      </div>

      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {/* THE FIX IS HERE: items-center is now items-start */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Enhanced Value Proposition */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm font-semibold rounded-full mb-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Trusted by 10,000+ families across Africa
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                Your Personal{' '}
              </span>
              <span className="relative">
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-pulse">
                  Health Insurance
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transform scale-x-0 animate-[scaleX_2s_ease-in-out_0.8s_forwards]"></div>
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                Guide for Africa.
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              HealthHalo uses <span className="font-semibold text-emerald-700">advanced AI</span> to find 
              affordable, personalized health insurance plans for you and your family. 
              <span className="block mt-2 text-lg text-slate-500">
                Simple, trustworthy, and built specifically for Africa.
              </span>
            </p>

            {/* Enhanced Features List */}
            <ul className="space-y-4 text-left inline-block">
              {features.map((feature, index) => (
                <li 
                  key={index}
                  className={`flex items-center group transition-all duration-500 hover:translate-x-2 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                  style={{ transitionDelay: feature.delay }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="text-lg text-slate-700 font-medium group-hover:text-emerald-700 transition-colors duration-300">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Stats Section */}
            <div className={`flex flex-wrap gap-8 mt-10 justify-center lg:justify-start transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '600ms'}}>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">10,000+</div>
                <div className="text-sm text-slate-500">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">50+</div>
                <div className="text-sm text-slate-500">Insurance Partners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">24/7</div>
                <div className="text-sm text-slate-500">AI Support</div>
              </div>
            </div>
          </div>

          {/* Right Side: Enhanced Auth Form Container */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '300ms'}}>
            <div className="relative">
              {/* Glowing background for form */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-3xl blur-xl transform scale-110"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-100/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
                </div>
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-white/80"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;