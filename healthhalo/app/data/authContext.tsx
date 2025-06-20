import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://healthhalo.onrender.com";

// The shape of the user profile, matching the API's snake_case
export interface ApiUserProfile {
  full_name: string;
  date_of_birth: string;
  gender: string;
  occupation: string;
  activityLevel: string; // Assuming you have this in your backend, mapping to exercise_frequency
  [key: string]: any; 
}

// What our context will provide to other components
interface AuthContextType {
  userProfile: ApiUserProfile | null;
  isLoading: boolean;
  fetchUserProfile: () => void; // A function to trigger a data refresh
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<ApiUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    // Set loading to true only if we don't have a profile yet
    if (!userProfile) setIsLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/health-sub/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile in context:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // This is not a failure, it just means the profile is new.
        setUserProfile(null);
      } else {
        // For other errors, we can clear the profile
        setUserProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]); // Dependency on userProfile helps prevent re-fetching if data is already there.

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const value = { userProfile, isLoading, fetchUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// This is a custom hook that makes it easy to use our context in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};