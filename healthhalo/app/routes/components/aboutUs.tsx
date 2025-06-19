import React from 'react';
import { Heart, Target, Users } from 'lucide-react';

const AboutUsSection = () => {
  return (
    <section id="aboutus" className="relative py-20 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-100/30 to-cyan-100/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="lg:pr-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm font-semibold rounded-full mb-6">
              Our Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Bridging Africa's Health Insurance Gap with Technology.
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              We started HealthHalo with a simple but powerful belief: access to quality healthcare is a fundamental human right, not a privilege for the few. Millions across Africa face financial hardship from unexpected medical bills due to a lack of accessible and trustworthy insurance.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our mission is to change that. By leveraging the power of AI and the widespread use of mobile technology, we are making health insurance simple, affordable, and transparent for everyone.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white mr-4 mt-1">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Empathy-Driven</h4>
                  <p className="text-slate-500">We build for the real-life needs of our communities.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white mr-4 mt-1">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Tech-Powered</h4>
                  <p className="text-slate-500">Using AI to create simple solutions for complex problems.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 lg:h-auto">
             <div className="w-full h-full bg-emerald-200 rounded-2xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
             </div>
             <div className="absolute -top-4 -left-4 w-full h-full border-4 border-emerald-400 rounded-2xl -rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
             <div className="absolute -bottom-8 -right-8 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
                <p className="font-semibold text-slate-700">"Our goal is a healthier Africa."</p>
                <p className="text-sm text-slate-500">- The HealthHalo Founders</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;