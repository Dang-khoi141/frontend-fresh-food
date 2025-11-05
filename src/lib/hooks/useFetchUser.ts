import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { UseFetchUserReturn, UserProfile } from "../interface/user";
import { userService } from "../service/user.service";

export function useFetchUser(): UseFetchUserReturn {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User ID không tìm thấy");
      }

      const profile = await userService.getUserById(userId);
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải hồ sơ");
      console.error("Failed to fetch user profile:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id && status === "authenticated") {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session?.user?.id, status, fetchUserProfile]);

  return {
    userProfile,
    loading,
    error,
    refetch: fetchUserProfile,
  };
}
