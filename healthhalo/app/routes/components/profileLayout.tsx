import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Calendar,
  Heart,
  Activity,
  Briefcase,
  CheckCircle,
  Sparkles,
  UserCircle,
} from "lucide-react";

const API_BASE_URL = "https://healthhalo.onrender.com";

// A profile type that EXACTLY matches the backend API response
interface ApiUserProfile {
  full_name: string;
  date_of_birth: string;
  gender: "M" | "F" | "";
  marital_status: string;
  occupation: string;                   
  location: string;                      
  income_range: string;                  
  weight_category: string;               
  height_cm: number;
  weight_kg: number;
  conditions: string[];
  medications: string[];
  allergies: string[];
  surgeries: string[];
  family_history: string[];
  is_smoker: boolean;
  alcohol_use: boolean;
  exercise_frequency: string;
  diet_type: string;
  sleep_hours: number;
  knows_blood_pressure: boolean;
  bp_checked_recently: boolean;
  nearest_facility: string;             
  facility_distance: string;           
  has_insurance: boolean;
  insurance_details: string;
}

const FormSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60">
    <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-6 border-b border-slate-200 pb-3">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const ProfileLayout = () => {
  const [profile, setProfile] = useState<ApiUserProfile | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "fetching" | "saving" | "success" | "error"
  >("fetching");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setSaveStatus("fetching");
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setSaveStatus("error");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/health-sub/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          ...response.data,
          conditions: response.data.conditions || [],
          medications: response.data.medications || [],
          allergies: response.data.allergies || [],
          surgeries: response.data.surgeries || [],
          family_history: response.data.family_history || [],
        });
        setSaveStatus("idle");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setProfile({} as ApiUserProfile);
          setSaveStatus("idle");
        } else {
          setError("Failed to load your profile. Please try again later.");
          setSaveStatus("error");
        }
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isBoolean = [
      "is_smoker",
      "alcohol_use",
      "has_insurance",
      "knows_blood_pressure",
      "bp_checked_recently",
    ].includes(name);
    setProfile((prev) =>
      prev ? { ...prev, [name]: isBoolean ? value === "true" : value } : null
    );
  };

  const handleMultiSelectChange = (
    name: keyof ApiUserProfile,
    value: string
  ) => {
    setProfile((prev) => {
      if (!prev) return null;
      const currentValues = (prev[name] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!profile) return;
  
  setSaveStatus("saving");
  setError(null);
  
  const token = localStorage.getItem("access_token");
  
  if (!token) {
    setError("Authentication token not found. Please log in again.");
    setSaveStatus("error");
    return;
  }

  // Validate required fields before sending
  const requiredFields = {
    full_name: profile.full_name,
    date_of_birth: profile.date_of_birth,
    gender: profile.gender
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value || value === "")
    .map(([key]) => key.replace(/_/g, " "));

  if (missingFields.length > 0) {
    setError(`Please fill in the following required fields: ${missingFields.join(", ")}`);
    setSaveStatus("error");
    return;
  }

  // Clean and validate the payload
  const payload = {
    ...profile,
    // Ensure numeric fields are properly converted
    height_cm: profile.height_cm ? Number(profile.height_cm) : null,
    weight_kg: profile.weight_kg ? Number(profile.weight_kg) : null,
    sleep_hours: profile.sleep_hours ? Number(profile.sleep_hours) : null,
    
    // Ensure arrays are always arrays
    conditions: Array.isArray(profile.conditions) ? profile.conditions : [],
    medications: Array.isArray(profile.medications) ? profile.medications : [],
    allergies: Array.isArray(profile.allergies) ? profile.allergies : [],
    surgeries: Array.isArray(profile.surgeries) ? profile.surgeries : [],
    family_history: Array.isArray(profile.family_history) ? profile.family_history : [],
    
    // Ensure booleans are properly set
    is_smoker: Boolean(profile.is_smoker),
    alcohol_use: Boolean(profile.alcohol_use),
    has_insurance: Boolean(profile.has_insurance),
    knows_blood_pressure: Boolean(profile.knows_blood_pressure),
    bp_checked_recently: Boolean(profile.bp_checked_recently),
  };

  // Remove any undefined or null string values
  Object.keys(payload).forEach(key => {
    const typedKey = key as keyof typeof payload;
    if (payload[typedKey] === undefined || payload[typedKey] === null) {
      if (typeof payload[typedKey] === 'string') {
        (payload as any)[typedKey] = '';
      }
    }
  });

  console.log("Payload being sent:", payload); // Debug log

  try {
    const response = await axios.put(`${API_BASE_URL}/api/health-sub/`, payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log("Save successful:", response.data); // Debug log
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 3000);
    
  } catch (err) {
    console.error("Save error:", err); // Debug log
    
    let errorMessage = "Failed to save profile. Please try again.";
    
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        // Optionally redirect to login
        // window.location.href = '/login';
      } else if (err.response?.status === 400) {
        // Handle validation errors
        const validationErrors = err.response.data;
        if (typeof validationErrors === 'object') {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => {
              const fieldName = field.replace(/_/g, ' ');
              const messageArray = Array.isArray(messages) ? messages : [messages];
              return `${fieldName}: ${messageArray.join(', ')}`;
            })
            .join('\n');
          errorMessage = `Validation errors:\n${errorMessages}`;
        } else {
          errorMessage = `Validation error: ${validationErrors}`;
        }
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to update this profile.";
      } else if (err.response && typeof err.response.status === "number" && err.response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
    } else if (typeof err === "object" && err !== null && "message" in err) {
      errorMessage = `Network error: ${(err as { message: string }).message}`;
    }
    
    setError(errorMessage);
    setSaveStatus("error");
  }
};

// Enhanced input validation helper
const validateProfile = (profile: ApiUserProfile): string[] => {
  const errors: string[] = [];
  
  if (!profile.full_name?.trim()) {
    errors.push("Full name is required");
  }
  
  if (!profile.date_of_birth) {
    errors.push("Date of birth is required");
  } else {
    const birthDate = new Date(profile.date_of_birth);
    const today = new Date();
    if (birthDate > today) {
      errors.push("Date of birth cannot be in the future");
    }
  }
  
  if (profile.height_cm && (Number(profile.height_cm) < 50 || Number(profile.height_cm) > 300)) {
    errors.push("Height must be between 50-300 cm");
  }
  
  if (profile.weight_kg && (Number(profile.weight_kg) < 20 || Number(profile.weight_kg) > 500)) {
    errors.push("Weight must be between 20-500 kg");
  }
  
  if (profile.sleep_hours && (Number(profile.sleep_hours) < 1 || Number(profile.sleep_hours) > 24)) {
    errors.push("Sleep hours must be between 1-24");
  }
  
  return errors;
};

  if (saveStatus === "fetching")
    return <div className="text-center p-10">Loading Profile...</div>;
  if (error) return <div className="text-red-500 p-10">{error}</div>;
  if (!profile) return <div>Could not load profile information.</div>;

  return (
    <div className="animate-fadeInUp">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
              My Profile
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              This information powers all AI features on HealthHalo.
            </p>
          </div>
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="mt-4 md:mt-0 w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center"
          >
            {saveStatus === "saving" && (
              <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
            )}
            {saveStatus === "success" && (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            {saveStatus === "idle" && "Save Changes"}
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "success" && "Profile Saved!"}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <UserCircle className="h-20 w-20 text-white/80" />
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition"
                >
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {profile.full_name || "Your Name"}
              </h2>
            </div>
            <FormSection
              title="Demographics"
              icon={<User className="mr-2 text-emerald-600" />}
            >
              <div className="space-y-4">
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={profile.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <input
                  type="date"
                  name="date_of_birth"
                  value={profile.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md text-slate-500"
                />
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <select
                  name="marital_status"
                  value={profile.marital_status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Marital Status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                </select>
              </div>
            </FormSection>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <FormSection
              title="Medical History"
              icon={<Heart className="mr-2 text-emerald-600" />}
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Existing Conditions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      "Diabetes",
                      "Hypertension",
                      "Asthma",
                      "Cancer",
                      "Sickle Cell",
                    ].map((c) => (
                      <label key={c} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="conditions"
                          value={c}
                          checked={profile.conditions.includes(c)}
                          onChange={() =>
                            handleMultiSelectChange("conditions", c)
                          }
                          className="rounded text-emerald-500"
                        />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Family History
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      "Diabetes",
                      "Hypertension",
                      "Heart Disease",
                      "Cancer",
                    ].map((c) => (
                      <label key={c} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="family_history"
                          value={c}
                          checked={profile.family_history.includes(c)}
                          onChange={() =>
                            handleMultiSelectChange("family_history", c)
                          }
                          className="rounded text-emerald-500"
                        />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FormSection>
            <FormSection
              title="Lifestyle & Vitals"
              icon={<Activity className="mr-2 text-emerald-600" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="height_cm"
                  placeholder="Height (cm)"
                  value={profile.height_cm}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                  required={false}
                />
                <input
                  type="number"
                  name="weight_kg"
                  placeholder="Weight (kg)"
                  value={profile.weight_kg}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                  required={false}
                />
                <select
                  name="exercise_frequency"
                  value={profile.exercise_frequency}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Exercise Frequency</option>
                  <option>1-2</option>
                  <option>3-5</option>
                  <option>Daily</option>
                </select>
                <select
                  name="diet_type"
                  value={profile.diet_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Diet Type</option>
                  <option>balanced</option>
                  <option>high-carb</option>
                  <option>vegetarian</option>
                </select>
                <select
                  name="is_smoker"
                  value={String(profile.is_smoker)}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="false">Non-Smoker</option>
                  <option value="true">Smoker</option>
                </select>
                <select
                  name="alcohol_use"
                  value={String(profile.alcohol_use)}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="false">Non-Drinker</option>
                  <option value="true">Drinker</option>
                </select>
              </div>
            </FormSection>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileLayout;
