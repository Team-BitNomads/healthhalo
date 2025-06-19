import { Shield, Heart, Activity, Brain, Droplets, Sun, Moon, Utensils, Zap, Wind, ShieldCheck, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface HealthTip {
  id: string;
  icon: LucideIcon;
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

// Our "database" of 20 possible health tips
const allHealthTips: HealthTip[] = [
  // --- General Tips (8) ---
  { id: 'gen1', icon: Droplets, color: 'bg-blue-500', title: 'Stay Hydrated', text: 'Drink at least 8 glasses (2 litres) of water daily for optimal health.', tags: ['general'] },
  { id: 'gen2', icon: Moon, color: 'bg-indigo-500', title: 'Quality Sleep', text: 'Aim for 7-9 hours of uninterrupted sleep per night to repair and recharge.', tags: ['general'] },
  { id: 'gen3', icon: Sun, color: 'bg-yellow-500', title: 'Get Some Sun', text: 'Spend 15-20 minutes in the sun for Vitamin D, but avoid peak hours.', tags: ['general'] },
  { id: 'gen4', icon: Brain, color: 'bg-purple-500', title: 'Manage Stress', text: 'Practice mindfulness or deep breathing for 5-10 minutes daily.', tags: ['general'] },
  { id: 'gen5', icon: Activity, color: 'bg-orange-500', title: 'Move Regularly', text: 'Stand up and stretch every hour, especially if you have a desk job.', tags: ['general'] },
  { id: 'gen6', icon: Utensils, color: 'bg-green-500', title: 'Eat Mindfully', text: 'Pay attention to your food and chew slowly to improve digestion and feel full.', tags: ['general'] },
  { id: 'gen7', icon: Wind, color: 'bg-cyan-400', title: 'Fresh Air', text: 'Open your windows daily to circulate fresh air in your home and workspace.', tags: ['general'] },
  { id: 'gen8', icon: ShieldCheck, color: 'bg-teal-500', title: 'Wash Hands', text: 'Wash your hands frequently with soap to prevent the spread of germs.', tags: ['general'] },

  // --- Condition-Specific Tips (5) ---
  { id: 'con1', icon: Heart, color: 'bg-red-500', title: 'Monitor Blood Sugar', text: 'If you have diabetes, check your blood sugar levels as recommended by your doctor.', tags: ['diabetes'] },
  { id: 'con2', icon: Zap, color: 'bg-red-600', title: 'Low-Salt Diet', text: 'For hypertension, reduce your salt intake to help manage blood pressure.', tags: ['hypertension'] },
  { id: 'con3', icon: Utensils, color: 'bg-rose-500', title: 'Control Carb Intake', text: 'For diabetes, focus on whole grains and be mindful of carbohydrate portions.', tags: ['diabetes'] },
  { id: 'con4', icon: Wind, color: 'bg-blue-400', title: 'Breathing Exercises', text: 'If you have asthma, practice controlled breathing techniques like pursed-lip breathing.', tags: ['asthma'] },
  { id: 'con5', icon: Shield, color: 'bg-orange-400', title: 'Avoid Trigggers', text: 'Identify and avoid foods or environmental factors that trigger your allergies.', tags: ['allergies'] },

  // --- Gender-Specific Tips (3) ---
  { id: 'fem1', icon: Shield, color: 'bg-pink-500', title: 'Calcium Intake', text: 'Women should ensure adequate intake of calcium and Vitamin D for bone health.', tags: ['female'] },
  { id: 'fem2', icon: Heart, color: 'bg-pink-600', title: 'Iron-Rich Foods', text: 'Incorporate iron-rich foods like spinach and lentils to prevent anemia.', tags: ['female'] },
  { id: 'mal1', icon: Heart, color: 'bg-sky-600', title: 'Prostate Health', text: 'Men over 45 should discuss prostate health screenings with their doctor.', tags: ['male', 'over_40'] },
  
  // --- Age-Specific Tips (2) ---
  { id: 'age1', icon: Activity, color: 'bg-cyan-500', title: 'Strength Training', text: 'Maintain muscle mass after 40 with strength training at least twice a week.', tags: ['over_40'] },
  { id: 'age2', icon: Eye, color: 'bg-indigo-600', title: 'Regular Eye Exams', text: 'Schedule comprehensive eye exams every 1-2 years, especially over 40.', tags: ['over_40'] },
  
  // --- Activity-Level Tips (2) ---
  { id: 'act1', icon: Activity, color: 'bg-lime-500', title: 'Fuel Your Workout', text: 'Consume protein and carbs within an hour post-workout to aid recovery.', tags: ['active', 'very_active'] },
  { id: 'sed1', icon: Zap, color: 'bg-orange-600', title: 'Incorporate Movement', text: 'If your lifestyle is sedentary, start with a 15-minute brisk walk daily.', tags: ['sedentary'] },
];

// The "Mock AI" function - This part remains the same and will work with the new data
export const generateHealthTips = (profile: UserProfile | null): HealthTip[] => {
  if (!profile) {
    const generalTips = allHealthTips.filter(tip => tip.tags.includes('general'));
    return generalTips.sort(() => 0.5 - Math.random()).slice(0, 7);
  }
  const userTags = new Set<string>(['general']);
  if (profile.gender) userTags.add(profile.gender);
  if (profile.conditions) profile.conditions.forEach(c => userTags.add(c.toLowerCase()));
  if (profile.activityLevel) userTags.add(profile.activityLevel);
  if (profile.dob) {
      const age = new Date().getFullYear() - new Date(profile.dob).getFullYear();
      if (age >= 40) userTags.add('over_40');
  }
  const recommendations = allHealthTips.filter(tip => tip.tags.some(tag => userTags.has(tag)));
  const uniqueRecommendations = Array.from(new Set(recommendations.map(tip => tip.id))).map(id => recommendations.find(tip => tip.id === id)!);
  return uniqueRecommendations.sort(() => 0.5 - Math.random()).slice(0, 7);
};