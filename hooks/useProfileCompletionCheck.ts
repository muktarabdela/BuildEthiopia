import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useProfileCompletionCheck() {
  const [checking, setChecking] = useState(false);

  const checkProfile = async (userId: string) => {
    setChecking(true);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_profile_complete, username")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return profile?.is_profile_complete;
    } catch (e) {
      return false;
    } finally {
      setChecking(false);
    }
  };

  return { checkProfile, checking };
}
