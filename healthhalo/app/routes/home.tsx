import React from 'react';
import type { MetaFunction } from "@remix-run/node";
import Navbar from './components/navbar';
import HeroSection from './components/heroSection';
import FeaturesSection from './components/featuresSection';
import AboutUsSection from './components/aboutUs';
import Footer from './components/footer';
import '../app.css';
import './i18n';

export const meta: MetaFunction = () => [
  { title: "HealthHalo" },
  { name: "description", content: "Your Personal Health Insurance Guide for Africa." },
];

function App() {
  return (
    <div className="App bg-[#F8F9FA]"> 
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutUsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;