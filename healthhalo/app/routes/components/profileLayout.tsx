import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Heart, Shield, Activity, Users, Info, CheckCircle, Sparkles, UserCircle } from 'lucide-react';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  location: string;
  monthlyIncome: string;
  conditions: string[];
  otherCondition: string;
  medications: string;
  allergies: string;
  smokerStatus: string;
  alcoholStatus: string;
  exerciseFrequency: string;
  dietDescription: string;
  hasDependents: string;
  dependentsCount: string;
  additionalInfo: string;
}

const ProfileLayout = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '', email: '', phone: '', dob: '', gender: '', maritalStatus: '', occupation: '', location: '', monthlyIncome: '',
    conditions: [], otherCondition: '', medications: '', allergies: '',
    smokerStatus: '', alcoholStatus: '', exerciseFrequency: '', dietDescription: '',
    hasDependents: 'no', dependentsCount: '',
    additionalInfo: '',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(prev => ({ ...prev, ...parsedProfile }));
    } else {
        setProfile(prev => ({...prev, fullName: 'Sodiq Adetola', email: 'sodiqadetola08@gmail.com'}));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfile(prev => {
        const currentConditions = prev.conditions || [];
        if(checked) {
            return {...prev, conditions: [...currentConditions, name]};
        } else {
            return {...prev, conditions: currentConditions.filter(c => c !== name)};
        }
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setSaveStatus('success');
      setTimeout(() => {
          setSaveStatus('idle');
          navigate('/dashboard'); // Go back to dashboard to see updated tips
      }, 2000);
    }, 1500);
  };

  const FormSection: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode}> = ({title, icon, children}) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-6 border-b border-slate-200 pb-3">{icon}{title}</h3>
        {children}
    </div>
  );

  return (
    <div className="animate-fadeInUp">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">My Profile</h1>
            <p className="text-slate-500 mt-2 text-lg">This information helps our AI find the best Health Insurance plans for you.</p>
          </div>
          <button type="submit" disabled={saveStatus === 'saving'} className="mt-4 md:mt-0 w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center">
            {saveStatus === 'saving' && <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>}
            {saveStatus === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
            {saveStatus === 'idle' && 'Save Changes'}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'success' && 'Profile Saved!'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg"><UserCircle className="h-20 w-20 text-white/80" /></div>
                    <button type="button" className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition"><Sparkles className="h-5 w-5 text-emerald-600" /></button>
                </div>
                <h2 className="text-xl font-bold text-slate-800">{profile.fullName || 'Your Name'}</h2>
                <p className="text-sm text-slate-500">{profile.email || 'your.email@example.com'}</p>
            </div>
             <FormSection title="Dependents" icon={<Users className="mr-2 text-emerald-600" />}>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-slate-600">Do you have any dependents?</label>
                        <select name="hasDependents" value={profile.hasDependents} onChange={handleInputChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md">
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                    {profile.hasDependents === 'yes' && (
                        <div>
                            <label className="text-sm font-medium text-slate-600">How many dependents?</label>
                            <input type="number" name="dependentsCount" value={profile.dependentsCount} onChange={handleInputChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., 3" />
                        </div>
                    )}
                </div>
            </FormSection>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <FormSection title="Personal Information" icon={<User className="mr-2 text-emerald-600" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="fullName" placeholder="Full Name" value={profile.fullName} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    <input type="email" name="email" placeholder="Email Address" value={profile.email} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    <input type="tel" name="phone" placeholder="Phone Number" value={profile.phone} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    <input type="date" name="dob" value={profile.dob} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md text-slate-500" />
                    <select name="gender" value={profile.gender} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option></select>
                    <select name="maritalStatus" value={profile.maritalStatus} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md"><option value="">Marital Status</option><option>Single</option><option>Married</option><option>Divorced</option></select>
                    <input type="text" name="occupation" placeholder="Occupation" value={profile.occupation} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    <select name="monthlyIncome" value={profile.monthlyIncome} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md"><option value="">Monthly Income (NGN)</option><option>Below 50,000</option><option>50,000 - 150,000</option><option>Above 150,000</option></select>
                </div>
            </FormSection>

            <FormSection title="Health & Lifestyle" icon={<Heart className="mr-2 text-emerald-600" />}>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600">Do you have any of these conditions?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {['Diabetes', 'Hypertension', 'Asthma', 'Sickle Cell', 'Epilepsy'].map(c => (
                                <label key={c} className="flex items-center space-x-2"><input type="checkbox" name={c} checked={profile.conditions.includes(c)} onChange={handleCheckboxChange} className="rounded text-emerald-500" /><span>{c}</span></label>
                            ))}
                        </div>
                    </div>
                     <input type="text" name="otherCondition" placeholder="Any other conditions? (comma-separated)" value={profile.otherCondition} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" />
                     <input type="text" name="allergies" placeholder="List any known allergies" value={profile.allergies} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    <select name="exerciseFrequency" value={profile.exerciseFrequency} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md"><option value="">How often do you exercise?</option><option>None</option><option>1-2 times/week</option><option>3-5 times/week</option><option>Daily</option></select>
                    <select name="smokerStatus" value={profile.smokerStatus} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md"><option value="">Do you smoke?</option><option>No</option><option>Yes</option><option>Occasionally</option></select>
                </div>
            </FormSection>
            
            <FormSection title="Additional Information" icon={<Info className="mr-2 text-emerald-600" />}>
                 <textarea name="additionalInfo" value={profile.additionalInfo} onChange={handleInputChange} rows={4} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="Is there anything else you'd like our AI to know about your health needs or preferences?"></textarea>
            </FormSection>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileLayout;