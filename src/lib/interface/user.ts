import { ChangeEvent, FormEvent } from "react";
import { TabId } from "../components/profile-page/user/profile-slidebar";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  createdAt?: string;
}

export interface UseFetchUserReturn {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface ProfileSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  userName: string;
  userEmail: string;
  userAvatar?: string;
}

export interface UserProfileFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  formErrors: Record<string, string>;
  message: { type: "success" | "error"; text: string } | null;
  isSaving: boolean;
  isUploadingAvatar: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export interface ChangePasswordProps {
  userEmail: string;
}

export interface SendOtpStepProps {
  userEmail: string;
  loading: boolean;
  error: string;
  onSendOtp: () => void;
}

export interface VerifyOtpStepProps {
  userEmail: string;
  otp: string;
  loading: boolean;
  error: string;
  countdown: number;
  onOtpChange: (value: string) => void;
  onVerify: (e: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
}

export interface InputPasswordStepProps {
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  error: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}
