// components/AuthProvider.tsx (Updated)
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase"; // Make sure this path is correct
import WelcomeDialog from "./WelcomeDialog";
// import LoadingSpinner from './LoadingSpinner'; // Optional: Import a loading spinner

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean; // Indicates initial auth state resolution AND profile check
  signOut: () => Promise<void>; // Add signOut method
}

// Create context with a default value including signOut
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => { console.warn("SignOut function called before AuthProvider initialized"); }, // Default dummy function
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Loading for initial auth check AND profile status
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [profileUsername, setProfileUsername] = useState<string | null>(null); // Store username for redirect

  const router = useRouter();

  // Function to perform the profile check
  const checkProfileCompletion = async (userId: string) => {
    console.log("AuthProvider: Checking profile completion for user:", userId);
    try {
      const { data: profile, error } = await supabase
        .from('profiles') // Your profiles table name
        .select('is_profile_complete, username') // Fetch status and username
        .eq('id', userId)
        .single(); // Expect one profile per user
      console.log("AuthProvider: Profile data fetched:", profile, error);
      if (error) {
        // Handle case where profile might not exist yet (e.g., timing issue after signup)
        if (error.code === 'PGRST116') { // PostgreSQL code for "Not Found"
          console.warn(`AuthProvider: Profile not found for user ${userId}. Waiting for creation or manual completion.`);
          // Decide if you want to show the dialog anyway or wait. Assuming wait for now.
          setShowWelcomeDialog(false);
        } else {
          console.error('AuthProvider: Error fetching profile:', error.message);
          setShowWelcomeDialog(false); // Don't show dialog on error
        }
        setProfileUsername(null); // Clear username on error
        return false; // Indicate profile check failed or profile incomplete/not found
      }

      if (profile && !profile.is_profile_complete) {
        console.log("AuthProvider: Profile incomplete. Triggering welcome dialog.");
        setProfileUsername(profile.username); // Store username for redirect
        setShowWelcomeDialog(true);
        return false; // Indicate profile is incomplete
      } else if (profile && profile.is_profile_complete) {
        console.log("AuthProvider: Profile complete.");
        setShowWelcomeDialog(false);
        setProfileUsername(profile.username); // Store username even if complete (might be useful elsewhere)
        return true; // Indicate profile is complete
      } else {
        // Should not happen if profile found, but as a fallback
        setShowWelcomeDialog(false);
        setProfileUsername(null);
        return false;
      }

    } catch (err) {
      console.error('AuthProvider: Exception during profile check:', err);
      setShowWelcomeDialog(false);
      setProfileUsername(null);
      return false; // Indicate profile check failed
    }
  };

  // Effect to handle auth state changes and initial load
  useEffect(() => {
    setLoading(true); // Start loading when effect runs

    // 1. Check initial session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("AuthProvider: Initial session fetch completed.", !!currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      let isProfileComplete = false;
      if (currentSession?.user) {
        // If logged in initially, check profile immediately
        isProfileComplete = await checkProfileCompletion(currentSession.user.id);
      }

      // Initial load complete ONLY after session check AND potential profile check
      setLoading(false);
      // console.log("AuthProvider: Initial loading finished. Profile Complete:", isProfileComplete);

    }).catch(error => {
      console.error("AuthProvider: Error fetching initial session:", error);
      setLoading(false); // Ensure loading stops on error
    });


    // 2. Set up listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("AuthProvider: Auth state change event:", event, !!newSession);

        // Always update session and user state
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setShowWelcomeDialog(false); // Reset dialog on any auth change initially
        setProfileUsername(null); // Reset username

        // Start loading indicator specifically for SIGNED_IN processing
        if (event === "SIGNED_IN" && newSession?.user) {
          setLoading(true); // Show loading while checking profile after sign-in
          await checkProfileCompletion(newSession.user.id);
          setLoading(false); // Hide loading after check is done
        } else if (event === "SIGNED_OUT") {
          // No profile check needed on sign out
          setLoading(false); // Ensure loading is false on sign out
        } else {
          // For other events (e.g., USER_UPDATED, PASSWORD_RECOVERY), just ensure loading is false
          setLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log("AuthProvider: Unsubscribing auth listener.");
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array: Run only once on mount to set up listener

  // Sign out function
  const handleSignOut = async () => {
    setLoading(true); // Show loading during sign out
    setShowWelcomeDialog(false); // Ensure dialog is hidden
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // State updates (user, session) will be handled by onAuthStateChange listener
      // Optionally force redirect if listener is slow or fails
      router.push('/login');
    } catch (error: any) {
      console.error("AuthProvider: Error signing out:", error.message);
      // Still attempt state reset manually if needed, though listener should catch it
      setSession(null);
      setUser(null);
      setLoading(false); // Stop loading on error
    }
    // Loading state will be set to false by the SIGNED_OUT event in the listener
  };

  // Value provided to context consumers
  const value = {
    session,
    user,
    loading,
    signOut: handleSignOut, // Provide the actual signout function
  };

  // Render loading state or children
  // Optionally show a full-screen loader during the *very* initial check
  if (loading && !session && !user) {
    // You might want a different loading indicator here for the initial app load
    // return <LoadingSpinner fullPage={true} message="Initializing..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Render Welcome Dialog conditionally */}
      {showWelcomeDialog && user && profileUsername && (
        <WelcomeDialog
          user={user}
          onClose={() => {
            console.log("AuthProvider: Welcome dialog closed manually.");
            setShowWelcomeDialog(false);
            // Decide if you want to allow closing without completing.
            // If not, remove the onClose prop/button from WelcomeDialog itself.
          }}
          onCompleteRedirect={() => {
            console.log("AuthProvider: Redirecting to profile completion.");
            setShowWelcomeDialog(false);
            if (profileUsername) { // Double check username exists
              router.push(`/${profileUsername}/complete`);
            } else {
              console.error("AuthProvider: Cannot redirect, profile username is missing!");
              // Show an error toast to the user?
            }
          }}
        />
      )}
    </AuthContext.Provider>
  );
}