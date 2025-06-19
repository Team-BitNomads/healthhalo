import React, { useState, useEffect } from 'react';
// --- STEP 1: Import useNavigate ---
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Globe, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react';
import { languages } from "../../data/languages"; // Make sure this path is correct

// FormInput component remains the same, as it's already perfect.
type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  label: string;
  field: string;
  isFocused: boolean;
  showPasswordToggle?: boolean;
  onToggleShowPassword?: () => void;
};

const FormInput: React.FC<FormInputProps> = ({ 
  icon, label, field, isFocused, showPasswordToggle, onToggleShowPassword, ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-emerald-600' : 'text-slate-400'}`}>
        {icon}
      </div>
      <input
        {...props}
        className={`w-full pl-12 pr-12 border-2 rounded-xl p-4 text-base transition-all duration-300 bg-white/50 backdrop-blur-sm ${isFocused ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-white' : 'border-slate-200 hover:border-slate-300'} focus:outline-none focus:ring-0 placeholder-slate-400`}
      />
      {showPasswordToggle && (
        <button type="button" onClick={onToggleShowPassword} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors duration-300">
          {props.type === 'text' ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
      {field === 'email' && props.value && String(props.value).includes('@') && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        </div>
      )}
    </div>
  </div>
);

// --- The Main AuthForm Component ---
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', phone: '', language: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState('');
  
  // --- STEP 2: Instantiate the navigate hook (Correct) ---
  const navigate = useNavigate();

  // Clear form data when switching between login/signup for a cleaner UX
  const toggleFormType = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '', phone: '', language: '' });
    setPasswordStrength(0);
  };

  useEffect(() => {
    if (formData.password && !isLogin) {
      let strength = 0;
      if (formData.password.length >= 8) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
      setPasswordStrength(strength);
    }
  }, [formData.password, isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // --- STEP 3: REFINED handleSubmit function with robust logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setIsLoading(false);

    // If the user just SIGNED UP, set a flag in localStorage.
    // This lets the dashboard know to show a welcome message.
    if (!isLogin) {
      localStorage.setItem('isNewUser', 'true');
    }

    // For BOTH login and sign-up, redirect to the main dashboard.
    // The dashboard itself will handle the welcome logic.
    // This is a cleaner separation of concerns.
    navigate('/dashboard');
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-400';
      case 2: return 'bg-orange-400';
      case 3: return 'bg-yellow-400';
      case 4: return 'bg-emerald-400';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };
  
  return (
    <div id="auth" className="relative w-full max-w-md">
      <div className="absolute -inset-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl blur-lg opacity-50"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back!' : 'Join HealthHalo'}
          </h2>
          <p className="text-slate-600 mt-2">
            {isLogin ? 'Access your Health Wallet and continue.' : 'Start your journey to better health coverage.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* --- TRANSITION CONTAINER FOR LOGIN FIELDS --- */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLogin ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-5 mb-5">
              <FormInput 
                icon={<User className="h-5 w-5" />} 
                label="Username or Email"
                field="username" name="username" type="text" 
                placeholder="Enter your username or email" 
                required={isLogin} value={formData.username}
                onChange={handleInputChange} onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField('')} isFocused={focusedField === 'username'}
              />
            </div>
          </div>
          
          {/* --- TRANSITION CONTAINER FOR SIGN UP FIELDS --- */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${!isLogin ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-5">
              <FormInput 
                icon={<User className="h-5 w-5" />} 
                label="Full Name"
                field="username" name="username" type="text" 
                placeholder="Enter your full name" 
                required={!isLogin} value={formData.username}
                onChange={handleInputChange} onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField('')} isFocused={focusedField === 'username'}
              />
              <FormInput 
                icon={<Mail className="h-5 w-5" />} 
                label="Email Address"
                field="email" name="email" type="email" 
                placeholder="Enter your email address" 
                required={!isLogin} value={formData.email}
                onChange={handleInputChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} isFocused={focusedField === 'email'}
              />
            </div>
          </div>

          {/* Password field is common to both, so it stays outside the transition containers */}
          <div className="space-y-2 mt-5">
            <FormInput 
              icon={<Lock className="h-5 w-5" />} 
              label="Password"
              field="password" name="password" type={showPassword ? "text" : "password"}
              placeholder="Enter your password" 
              required value={formData.password}
              onChange={handleInputChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} isFocused={focusedField === 'password'}
              showPasswordToggle={true} onToggleShowPassword={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* --- TRANSITION CONTAINER FOR MORE SIGN UP FIELDS --- */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${!isLogin ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-5 mt-5">
              {formData.password && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Password strength</span>
                    <span className={`font-medium ${passwordStrength >= 3 ? 'text-emerald-600' : 'text-orange-600'}`}>{getPasswordStrengthText()}</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (<div key={level} className={`h-2 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getPasswordStrengthColor() : 'bg-slate-200'}`} />))}
                  </div>
                </div>
              )}
              <FormInput 
                icon={<Phone className="h-5 w-5" />} 
                label="Phone Number"
                field="phone" name="phone" type="tel" 
                placeholder="e.g. +234 123 456 7890" 
                required={!isLogin} value={formData.phone}
                onChange={handleInputChange} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} isFocused={focusedField === 'phone'}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Preferred Language</label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'language' ? 'text-emerald-600' : 'text-slate-400'}`}><Globe className="h-5 w-5" /></div>
                  <select 
                    required={!isLogin} name="language" value={formData.language}
                    onFocus={() => setFocusedField('language')} onBlur={() => setFocusedField('')} onChange={handleInputChange}
                    className={`w-full pl-12 pr-10 border-2 rounded-xl p-4 text-base transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer ${focusedField === 'language' ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-white' : 'border-slate-200 hover:border-slate-300'} ${formData.language ? 'text-slate-800' : 'text-slate-400'} focus:outline-none focus:ring-0`}
                  >
                    <option value="" disabled>Choose your language</option>
                    {languages.map(lang => (<option key={lang.code} value={lang.code} className="text-slate-800">{lang.name}</option>))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            type="submit" disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-xl font-semibold text-base transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 group relative overflow-hidden"
          >
            <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>{isLogin ? 'Sign In to Your Account' : 'Create Your Account'}</span>
            {isLoading && (<div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>)}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </form>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden text-center ${isLogin ? 'max-h-[100px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
          <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-300 font-medium">
            Forgot your password?
          </a>
        </div>

        <div className="mt-8 text-center relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative bg-white/80 px-4 inline-block"><span className="text-sm text-slate-500">{isLogin ? "New to HealthHalo?" : "Already have an account?"}</span></div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleFormType}
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            {isLogin ? 'Create a new account' : 'Sign in instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;