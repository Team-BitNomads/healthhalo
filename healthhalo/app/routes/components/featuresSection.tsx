import React from 'react';
import { Bot, Languages, Wallet, FileText, HeartHandshake } from 'lucide-react';

const featureData = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: "AI-Powered Advisor",
    description: "Our smart AI guides you through simple questions to find the perfect, most affordable insurance plan for your needs."
  },
  {
    icon: <Languages className="h-8 w-8" />,
    title: "Multilingual Support",
    description: "Interact with our service in your local language, including Swahili, Yoruba, Igbo, and more, via chat or voice."
  },
  {
    icon: <Wallet className="h-8 w-8" />,
    title: "Integrated Health Wallet",
    description: "Save small amounts for premiums and co-pays. Pay seamlessly with Mobile Money (M-Pesa, etc.)."
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Automated Claims",
    description: "Simply upload a photo of your medical bill. Our AI reads it, fills out the form, and submits your claim automatically."
  },
  {
    icon: <HeartHandshake className="h-8 w-8" />,
    title: "Community Partnerships",
    description: "We connect you with trusted local clinics and telemedicine providers for low-cost, high-quality care."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Everything You Need for Peace of Mind
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            HealthHalo is more than just insurance. It's a complete health companion designed for you.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-50 to-emerald-50/20 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-emerald-200"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="mt-2 text-slate-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
          ))}
          <div className="group relative p-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center text-center text-white">
                <h3 className="text-2xl font-bold">And so much more...</h3>
                <p className="mt-2">We are constantly adding new features to better serve you and your family's health needs.</p>
                <a href="#auth" className="mt-6 px-6 py-3 bg-white/30 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/40 transition-colors duration-300">
                    Get Started Now
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;