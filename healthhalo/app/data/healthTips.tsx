import { Shield, Heart, Activity, Brain, Droplets, Sun, Moon, Utensils, Zap, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // Import the type for the icon component

export interface HealthTip {
  id: string;
  icon: LucideIcon; // <-- CHANGE: We pass the component reference itself
  color: string;
  title: string;
  text: string;
  tags: string[];
}

export interface UserProfile {
  fullName?: string;
  dob?: string;
  gender?: 'male' | 'female' | '';
  conditions?: string[];
  activityLevel?: 'sedentary' | 'active' | 'very_active' | '';
}

// Our "database" of ~30 possible health tips
const allHealthTips: HealthTip[] = [
  // General
  { id: 'gen1', icon: Droplets, color: 'bg-blue-500', title: 'Stay Hydrated', text: 'Drink at least 8 glasses (2 litres) of water throughout the day.', tags: ['general'] },
  { id: 'gen2', icon: Moon, color: 'bg-indigo-500', title: 'Quality Sleep', text: 'Aim for 7-9 hours of uninterrupted sleep per night for better health.', tags: ['general'] },
  { id: 'gen3', icon: Sun, color: 'bg-yellow-500', title: 'Get Some Sun', text: 'Spend 15-20 minutes in the sun for Vitamin D, but avoid peak hours.', tags: ['general'] },
  { id: 'gen4', icon: Brain, color: 'bg-purple-500', title: 'Manage Stress', text: 'Practice mindfulness or deep breathing for 5 minutes daily.', tags: ['general'] },
  { id: 'gen5', icon: Activity, color: 'bg-orange-500', title: 'Move Regularly', text: 'Even if you have a desk job, stand up and stretch every hour.', tags: ['general'] },
  { id: 'gen6', icon: Utensils, color: 'bg-green-500', title: 'Eat Mindfully', text: 'Pay attention to your food and chew slowly to improve digestion.', tags: ['general'] },
  { id: 'gen7', icon: Wind, color: 'bg-cyan-400', title: 'Fresh Air', text: 'Open your windows daily to circulate fresh air in your home.', tags: ['general'] },
  { id: 'gen8', icon: Shield, color: 'bg-teal-500', title: 'Wash Hands', text: 'Wash your hands frequently with soap and water to prevent infections.', tags: ['general'] },

  // Condition-Specific
  { id: 'con1', icon: Heart, color: 'bg-red-500', title: 'Monitor Blood Sugar', text: 'If you have diabetes, check your blood sugar levels as recommended by your doctor.', tags: ['diabetes'] },
  { id: 'con2', icon: Heart, color: 'bg-red-600', title: 'Low-Salt Diet', text: 'For hypertension, reduce your salt intake to help manage blood pressure.', tags: ['hypertension'] },
  { id: 'con3', icon: Activity, color: 'bg-rose-500', title: 'Control Carb Intake', text: 'For diabetes, focus on whole grains and mindful portions.', tags: ['diabetes'] },
  { id: 'con4', icon: Shield, color: 'bg-rose-600', title: 'Daily Foot Checks', text: 'Diabetic individuals should inspect their feet daily for cuts or sores.', tags: ['diabetes'] },
  { id: 'con5', icon: Zap, color: 'bg-red-500', title: 'Know BP Numbers', text: 'Monitor your blood pressure at home if you have hypertension.', tags: ['hypertension'] },
  { id: 'con6', icon: Wind, color: 'bg-blue-400', title: 'Breathing Exercises', text: 'If you have asthma, practice controlled breathing exercises.', tags: ['asthma'] },
  { id: 'con7', icon: Utensils, color: 'bg-orange-400', title: 'Avoid Trigggers', text: 'Identify and avoid foods that trigger your allergies.', tags: ['allergies'] },

  // Gender-Specific
  { id: 'fem1', icon: Shield, color: 'bg-pink-500', title: 'Calcium Intake', text: 'Women should ensure adequate intake of calcium for bone health.', tags: ['female'] },
  { id: 'fem2', icon: Heart, color: 'bg-pink-600', title: 'Folic Acid', text: 'Important for women of childbearing age.', tags: ['female'] },
  { id: 'mal1', icon: Heart, color: 'bg-sky-600', title: 'Prostate Health', text: 'Men over 45 should discuss prostate health screenings with their doctor.', tags: ['male', 'over_40'] },
  { id: 'mal2', icon: Activity, color: 'bg-sky-500', title: 'Heart Health', text: 'Men are at a higher risk of heart disease; focus on cardio.', tags: ['male'] },
  
  // Age-Specific
  { id: 'age1', icon: Activity, color: 'bg-cyan-500', title: 'Strength Training', text: 'Maintain muscle mass after 40 with strength training twice a week.', tags: ['over_40'] },
  { id: 'age2', icon: Brain, color: 'bg-purple-600', title: 'Stay Mentally Active', text: 'Challenge your brain with puzzles or learning new skills as you age.', tags: ['over_40'] },
  { id: 'age3', icon: Shield, color: 'bg-teal-600', title: 'Regular Check-ups', text: 'Annual health check-ups become more important over 40.', tags: ['over_40'] },

  // Activity-Level
  { id: 'act1', icon: Activity, color: 'bg-lime-500', title: 'Fuel Your Workout', text: 'Consume protein and carbs post-workout to aid recovery.', tags: ['active', 'very_active'] },
  { id: 'act2', icon: Moon, color: 'bg-indigo-600', title: 'Active Recovery', text: 'On rest days, engage in light activities like walking or stretching.', tags: ['active', 'very_active'] },
  { id: 'sed1', icon: Zap, color: 'bg-orange-600', title: 'Incorporate Movement', text: 'If sedentary, start with a 15-minute daily walk.', tags: ['sedentary'] },
  { id: 'sed2', icon: Sun, color: 'bg-yellow-600', title: 'Take Walking Breaks', text: 'Replace a coffee break with a 5-minute walk outside.', tags: ['sedentary'] },
];

// The "Mock AI" function
export const generateHealthTips = (profile: UserProfile | null): HealthTip[] => {
  if (!profile) {
    // For a new user with no profile, shuffle and take 7 general tips
    const generalTips = allHealthTips.filter(tip => tip.tags.includes('general'));
    return generalTips.sort(() => 0.5 - Math.random()).slice(0, 7);
  }

  const userTags = new Set<string>(['general']);

  if (profile.gender) userTags.add(profile.gender);
  if (profile.conditions) profile.conditions.forEach(c => userTags.add(c.toLowerCase()));
  if (profile.activityLevel) userTags.add(profile.activityLevel);
  if (profile.dob) {
      const birthYear = new Date(profile.dob).getFullYear();
      const age = new Date().getFullYear() - birthYear;
      if (age >= 40) userTags.add('over_40');
  }

  const recommendations = allHealthTips.filter(tip => 
      tip.tags.some(tag => userTags.has(tag))
  );

  const uniqueRecommendations = Array.from(new Set(recommendations.map(tip => tip.id)))
      .map(id => recommendations.find(tip => tip.id === id)!);
  
  // Shuffle and return 7 tips dynamically
  return uniqueRecommendations.sort(() => 0.5 - Math.random()).slice(0, 7);
};