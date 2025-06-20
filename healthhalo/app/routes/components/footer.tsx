import React, { useState } from 'react';
import { ShieldCheck, Twitter, Facebook, Linkedin, Instagram, Youtube, Heart, ArrowUp, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  const [hoveredSection, setHoveredSection] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Company',
      id: 'company',
      links: [
        { name: 'About Us', href: '#about', icon: <Heart className="h-4 w-4" /> },
        { name: 'Careers', href: '#careers', icon: <Sparkles className="h-4 w-4" /> },
        { name: 'Partners', href: '#partners', icon: <ShieldCheck className="h-4 w-4" /> },
        { name: 'Press Kit', href: '#press', icon: <Mail className="h-4 w-4" /> }
      ]
    },
    {
      title: 'Resources',
      id: 'resources',
      links: [
        { name: 'Health Blog', href: '#blog', icon: <Heart className="h-4 w-4" /> },
        { name: 'Help Center', href: '#help', icon: <Phone className="h-4 w-4" /> },
        { name: 'FAQs', href: '#faq', icon: <Mail className="h-4 w-4" /> },
        { name: 'Insurance Guide', href: '#guide', icon: <ShieldCheck className="h-4 w-4" /> }
      ]
    },
    {
      title: 'Legal',
      id: 'legal',
      links: [
        { name: 'Privacy Policy', href: '#privacy', icon: <ShieldCheck className="h-4 w-4" /> },
        { name: 'Terms of Service', href: '#terms', icon: <Mail className="h-4 w-4" /> },
        { name: 'Cookie Policy', href: '#cookies', icon: <Heart className="h-4 w-4" /> },
        { name: 'Compliance', href: '#compliance', icon: <Sparkles className="h-4 w-4" /> }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: '#', color: 'hover:text-blue-500' },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: '#', color: 'hover:text-pink-500' },
    { name: 'YouTube', icon: <Youtube className="h-5 w-5" />, href: '#', color: 'hover:text-red-500' }
  ];

  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      {/* Wave separator */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            className="fill-slate-100"
          ></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <ShieldCheck className="h-10 w-10 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:scale-110 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent group-hover:from-emerald-200 group-hover:to-white transition-all duration-300">
                HealthHalo
              </span>
            </div>
            
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              Empowering African families with accessible, AI-driven health insurance solutions. 
              <span className="block mt-2 text-emerald-400 font-medium">Your health, our priority.</span>
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors duration-300">
                <Mail className="h-5 w-5 mr-3" />
                <span>hello@healthhalo.africa</span>
              </div>
              <div className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors duration-300">
                <Phone className="h-5 w-5 mr-3" />
                <span>+234 800 HEALTH (432584)</span>
              </div>
              <div className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors duration-300">
                <MapPin className="h-5 w-5 mr-3" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Stay Updated</h4>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={handleNewsletterSubmit}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    subscribed 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:scale-105'
                  }`}
                >
                  {subscribed ? '✓' : 'Subscribe'}
                </button>
              </div>
              {subscribed && (
                <p className="text-emerald-400 text-sm animate-fade-in">Thanks for subscribing! 🎉</p>
              )}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div
              key={section.id}
              className="space-y-4"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection('')}
            >
              <h3 className={`text-lg font-bold tracking-wide transition-all duration-300 ${
                hoveredSection === section.id 
                  ? 'text-emerald-400 scale-105' 
                  : 'text-white'
              }`}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center text-slate-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-2 group"
                    >
                      <span className="text-emerald-500/50 group-hover:text-emerald-400 mr-3 transition-colors duration-300">
                        {link.icon}
                      </span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-slate-400">
              <span>© {new Date().getFullYear()} HealthHalo.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              <span>for Africa</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`p-3 bg-slate-800/50 rounded-full text-slate-400 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} hover:bg-slate-700/50`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-semibold">Back to Top</span>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-8 border-t border-slate-700/30">
          <div className="flex flex-wrap items-center justify-center space-x-8 text-xs text-slate-500">
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500 mr-2" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-emerald-500 mr-2" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 text-emerald-500 mr-2" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500 mr-2" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;