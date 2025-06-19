import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import { languages } from "../../data/languages";
import { getCookie } from "../../utils/getCookie"; // Make sure this path is correct

// --- Reusable FormInput Component ---
type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  label: string;
  field: string;
  isFocused: boolean;
  showPasswordToggle?: boolean;
  onToggleShowPassword?: () => void;
};

const FormInput: React.FC<FormInputProps> = ({
  icon,
  label,
  field,
  isFocused,
  showPasswordToggle,
  onToggleShowPassword,
  ...props
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    <div className="relative group">
      <div
        className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
          isFocused ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        {icon}
      </div>
      <input
        {...props}
        className={`w-full pl-12 pr-12 border-2 rounded-xl p-4 text-base transition-all duration-300 bg-white/50 backdrop-blur-sm ${
          isFocused
            ? "border-emerald-500 shadow-lg shadow-emerald-500/20 bg-white"
            : "border-slate-200 hover:border-slate-300"
        } focus:outline-none focus:ring-0 placeholder-slate-400`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onToggleShowPassword}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors duration-300"
        >
          {props.type === "text" ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
      {field === "email" &&
        props.value &&
        String(props.value).includes("@") && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
        )}
    </div>
  </div>
);

// --- Terms and Conditions Modal Component ---
const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]">
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full m-4 transform animate-[scaleUp_0.4s_ease-in-out_forwards]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100"
      >
        <X className="h-5 w-5 text-slate-500" />
      </button>
      <h2 className="text-2xl font-bold text-slate-800">
        Terms and Conditions
      </h2>
      <div className="prose prose-sm mt-4 max-h-[60vh] overflow-y-auto pr-4 text-slate-600">
        <p>
          Welcome to HealthHalo. By creating an account, you agree to these
          terms:
        </p>
        <h4>1. Data Usage for AI Recommendations</h4>
        <p>
          You agree that HealthHalo may use the personal and health information
          you provide to power our AI recommendation engines. This data will be
          used to suggest personalized health insurance plans and provide
          tailored health tips. All data is handled securely and anonymized
          where possible.
        </p>
        <h4>2. No Medical Advice</h4>
        <p>
          The information and tips provided by HealthHalo are for informational
          purposes only and do not constitute medical advice. Always consult a
          qualified healthcare professional for any medical concerns.
        </p>
        <h4>3. Service Availability</h4>
        <p>
          While we strive for 100% uptime, the service may occasionally be
          unavailable for maintenance or due to unforeseen circumstances. We are
          not liable for any interruptions.
        </p>
        <h4>4. User Responsibilities</h4>
        <p>
          You are responsible for maintaining the confidentiality of your
          account password and for all activities that occur under your account.
        </p>
        <p>Last updated: June 19, 2025</p>
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={onClose}
          className="bg-emerald-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-emerald-700"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
);

const API_BASE_URL = "https://healthhalo.onrender.com";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    language: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
    };
    fetchCsrfToken();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFormType = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
      language: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  };

  return (
    <div id="auth" className="relative w-full max-w-md">
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}
      <div className="absolute -inset-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl blur-lg opacity-50"></div>
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back!" : "Join HealthHalo"}
          </h2>
          <p className="text-slate-600 mt-2">
            {isLogin
              ? "Access your Health Wallet and continue."
              : "Start your journey to better health coverage."}
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Login Form Fields */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isLogin ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <FormInput
                icon={<Mail className="h-5 w-5" />}
                label="Email Address"
                field="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required={isLogin}
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                isFocused={focusedField === "email"}
              />
            </div>

            {/* Signup Form Fields */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                !isLogin ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-5">
                <FormInput
                  icon={<User className="h-5 w-5" />}
                  label="Full Name"
                  field="username"
                  name="username"
                  type="text"
                  placeholder="Enter your full name"
                  required={!isLogin}
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  isFocused={focusedField === "username"}
                />
                <FormInput
                  icon={<Mail className="h-5 w-5" />}
                  label="Email Address"
                  field="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required={!isLogin}
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  isFocused={focusedField === "email"}
                />
              </div>
            </div>

            <FormInput
              icon={<Lock className="h-5 w-5" />}
              label="Password"
              field="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
              isFocused={focusedField === "password"}
              showPasswordToggle={true}
              onToggleShowPassword={() => setShowPassword(!showPassword)}
            />

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                !isLogin ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-5">
                <FormInput
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone Number"
                  field="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +234..."
                  required={!isLogin}
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField("")}
                  isFocused={focusedField === "phone"}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Preferred Language
                  </label>
                  <div className="relative group">
                    <div
                      className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                        focusedField === "language"
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      <Globe className="h-5 w-5" />
                    </div>
                    <select
                      required={!isLogin}
                      name="language"
                      value={formData.language}
                      onFocus={() => setFocusedField("language")}
                      onBlur={() => setFocusedField("")}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-10 border-2 rounded-xl p-4 text-base transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer ${
                        focusedField === "language"
                          ? "border-emerald-500 shadow-lg shadow-emerald-500/20 bg-white"
                          : "border-slate-200 hover:border-slate-300"
                      } ${
                        formData.language ? "text-slate-800" : "text-slate-400"
                      } focus:outline-none focus:ring-0`}
                    >
                      <option value="" disabled>
                        Choose your language
                      </option>
                      {languages.map((lang) => (
                        <option
                          key={lang.code}
                          value={lang.code}
                          className="text-slate-800"
                        >
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600">
                    I agree to the{" "}
                    <span
                      onClick={() => setShowTermsModal(true)}
                      className="font-semibold text-emerald-600 cursor-pointer hover:underline"
                    >
                      Terms and Conditions
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!isLogin && !agreedToTerms)}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-xl font-semibold text-base transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 group relative overflow-hidden"
          >
            <span
              className={`transition-all duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              {isLogin ? "Sign In to Your Account" : "Create Your Account"}
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </form>
        <div className="mt-8 text-center relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative bg-white/80 px-4 inline-block">
            <span className="text-sm text-slate-500">
              {isLogin ? "New to HealthHalo?" : "Already have an account?"}
            </span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleFormType}
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            {isLogin ? "Create a new account" : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
