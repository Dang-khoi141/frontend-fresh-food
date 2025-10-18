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

      if (!session?.user?.email) {
        throw new Error("Email không tìm thấy trong session");
      }

      const profile = await userService.getUserByEmail(session.user.email);
      setUserProfile(profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải hồ sơ";
      setError(errorMessage);
      console.error("Failed to fetch user profile:", err);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email && status === "authenticated") {
      fetchUserProfile();
    }
  }, [session?.user?.email, status, fetchUserProfile]);

  return {
    userProfile,
    loading,
    error,
    refetch: fetchUserProfile,
  };
}
