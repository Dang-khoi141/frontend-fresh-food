import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { UserProfile } from "../interface/user";
import { userService } from "../service/user.service";

type Message = { type: "success" | "error"; text: string } | null;

export function useProfileForm(
  userProfile: UserProfile | null,
  refetch: () => Promise<void>
) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: undefined as string | undefined,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        avatar: userProfile.avatar,
      });
    }
  }, [userProfile]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Tên không được để trống";
    }

    if (!formData.email?.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (
      formData.phone &&
      !/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      errors.phone = "Số điện thoại phải từ 10-11 chữ số";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Vui lòng chọn file hình ảnh" });
      return;
    }

    if (file.size > 1024 * 1024) {
      setMessage({ type: "error", text: "Dung lượng file tối đa 1 MB" });
      return;
    }

    setIsUploadingAvatar(true);
    setMessage(null);

    try {
      const imageUrl = await userService.uploadAvatar(userProfile!.id, file);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
      await refetch();
      setMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi tải ảnh lên";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await userService.updateProfile(userProfile!.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công" });
      await refetch();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Có lỗi khi cập nhật hồ sơ",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    formErrors,
    isSaving,
    message,
    isUploadingAvatar,
    setMessage,
    handleInputChange,
    handleAvatarUpload,
    handleSave,
  };
}
