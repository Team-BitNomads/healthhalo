import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import {
  User,
  Calendar,
  Heart,
  Shield,
  Activity,
  Users,
  Info,
  CheckCircle,
  Sparkles,
  UserCircle,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react";

// --- NEW: Define the profile state to match the API exactly ---
interface UserProfile {
  full_name: string;
  date_of_birth: string;
  gender: "M" | "F" | "";
  marital_status: string;
  occupation: string;
  location: string;
  income_range: string;
  height_cm: number | string; // Use string for input, convert on submit
  weight_kg: number | string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  surgeries: string[];
  family_history: string[];
  is_smoker: boolean;
  alcohol_use: boolean;
  exercise_frequency: string;
  diet_type: string;
  sleep_hours: number | string;
  knows_blood_pressure: boolean;
  bp_checked_recently: boolean;
  has_insurance: boolean;
  insurance_details: string;
}

const API_BASE_URL = "https://healthhalo.onrender.com"; 

const ProfileLayout = () => {
  // --- Initialize state with correct types ---
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    occupation: "",
    location: "",
    income_range: "",
    height_cm: "",
    weight_kg: "",
    conditions: [],
    medications: [],
    allergies: [],
    surgeries: [],
    family_history: [],
    is_smoker: false,
    alcohol_use: false,
    exercise_frequency: "",
    diet_type: "",
    sleep_hours: "",
    knows_blood_pressure: false,
    bp_checked_recently: false,
    has_insurance: false,
    insurance_details: "",
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "fetching" | "saving" | "success" | "error"
  >("fetching");
  const [error, setError] = useState<string | null>(null);

  // --- FETCH data from the backend when the component mounts ---
  useEffect(() => {
    const fetchProfile = async () => {
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

        // The API returns arrays, so we don't need to parse them from strings
        setProfile(response.data);
        setSaveStatus("idle");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          console.log("No profile found, user can create a new one.");
          setSaveStatus("idle"); // It's not an error if the profile doesn't exist yet
        } else {
          console.error("Failed to fetch profile:", err);
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
    // Handle boolean conversion for radio buttons/selects
    if (
      type === "radio" ||
      name === "is_smoker" ||
      name === "alcohol_use" ||
      name === "has_insurance" ||
      name === "knows_blood_pressure" ||
      name === "bp_checked_recently"
    ) {
      setProfile((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (name: keyof UserProfile, value: string) => {
    setProfile((prev) => {
      const currentValues = (prev[name] as string[]) || [];
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...currentValues, value] };
      }
    });
  };

  // --- SAVE data to the backend ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setError(null);
    const token = localStorage.getItem("access_token");

    // Prepare payload, converting necessary fields to correct types
    const payload = {
      ...profile,
      height_cm: Number(profile.height_cm) || 0,
      weight_kg: Number(profile.weight_kg) || 0,
      sleep_hours: Number(profile.sleep_hours) || 0,
    };

    try {
      await axios.put(`${API_BASE_URL}/api/health-sub/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(
        "Failed to save profile. Please check your inputs and try again."
      );
      setSaveStatus("error");
    }
  };

  // Reusable component for form sections
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

  if (saveStatus === "fetching") return <div>Loading Profile...</div>;
  if (saveStatus === "error")
    return <div className="text-red-500">{error}</div>;

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
            <FormSection
              title="Socio-Economic"
              icon={<Briefcase className="mr-2 text-emerald-600" />}
            >
              <div className="space-y-4">
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={profile.occupation}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (e.g., Lagos)"
                  value={profile.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <select
                  name="income_range"
                  value={profile.income_range}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Income (NGN)</option>
                  <option>Below 50,000</option>
                  <option>50,000-150,000</option>
                  <option>Above 150,000</option>
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
                />
                <input
                  type="number"
                  name="weight_kg"
                  placeholder="Weight (kg)"
                  value={profile.weight_kg}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
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
