"use client";

import Footer from "@/lib/components/landing-page/footer/footer";
import FreshNav from "@/lib/components/landing-page/header/header-nav";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAddressContext } from "../../contexts/address-context";
import OrderList from "../../lib/components/profile-page/order/order-list";
import ChangePassword from "../../lib/components/profile-page/password/change-password";
import UserProfileForm from "../../lib/components/profile-page/user/profile-form";
import ProfileSidebar, { TabId } from "../../lib/components/profile-page/user/profile-slidebar";
import { useFetchUser } from "../../lib/hooks/useFetchUser";
import { useProfileForm } from "../../lib/hooks/useProfileForm";

type Message = { type: "success" | "error"; text: string } | null;

export default function ProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();
    const { userProfile, loading, error, refetch } = useFetchUser();
    const { refreshAddress } = useAddressContext();

    const tabFromUrl = searchParams.get("tab") as TabId | null;
    const [activeTab, setActiveTab] = useState<TabId>(tabFromUrl || "profile");
    const [message, setMessage] = useState<Message>(null);

    const {
        formData,
        formErrors,
        isSaving,
        message: profileMessage,
        isUploadingAvatar,
        handleInputChange,
        handleAvatarUpload,
        handleSave,
    } = useProfileForm(userProfile, refetch);

    useEffect(() => {
        if (tabFromUrl) setActiveTab(tabFromUrl);
    }, [tabFromUrl]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (profileMessage) setMessage(profileMessage);
    }, [profileMessage]);

    const handleTabChange = (tab: TabId) => {
        setActiveTab(tab);

        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);

        router.push(`/profile-page?${params.toString()}`, { scroll: false });
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-emerald-600 border-t-transparent" />
            </div>
        );
    }

    if (error || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-md w-full">
                    <p className="text-sm sm:text-base text-gray-600 mb-4">{error || "Không thể tải hồ sơ"}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition text-sm sm:text-base"
                        >
                            Thử lại
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition text-sm sm:text-base"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <FreshNav />

            <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mt-20 sm:mt-24">
                {message && (
                    <div
                        className={`mb-4 p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${message.type === "success"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
                    <ProfileSidebar
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        userName={formData.name}
                        userEmail={formData.email}
                        userAvatar={formData.avatar}
                    />

                    <div className="col-span-12 lg:col-span-9">
                        {activeTab === "profile" && (
                            <UserProfileForm
                                formData={formData}
                                formErrors={formErrors}
                                message={profileMessage}
                                isSaving={isSaving}
                                isUploadingAvatar={isUploadingAvatar}
                                onInputChange={handleInputChange}
                                onAvatarUpload={handleAvatarUpload}
                                onSubmit={handleSave}
                            />
                        )}

                        {activeTab === "orders" && <OrderList />}

                        {activeTab === "password" && (
                            <ChangePassword userEmail={formData.email} />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
