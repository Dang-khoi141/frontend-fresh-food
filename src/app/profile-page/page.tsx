"use client";

import Footer from "@/lib/components/landing-page/footer/footer";
import FreshNav from "@/lib/components/landing-page/header/header-nav";
import {
    Clock,
    Heart,
    Mail,
    MapPin,
    Phone,
    ShoppingBag,
    User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFetchUser } from "../../lib/hooks/useFetchUser";

export default function ProfilePage() {
    const router = useRouter();
    const { status } = useSession();
    const { userProfile, loading, error, refetch } = useFetchUser();
    const [activeTab, setActiveTab] = useState("profile");

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        {error || "Không thể tải hồ sơ"}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            Thử lại
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: "profile", label: "Tài khoản của tôi", icon: User },
        { id: "address", label: "Địa chỉ", icon: MapPin },
        { id: "orders", label: "Đơn mua", icon: ShoppingBag },
        { id: "wishlist", label: "Yêu thích", icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-32">
            <FreshNav />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {userProfile.avatar ? (
                                        <img
                                            src={userProfile.avatar}
                                            alt={userProfile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {userProfile.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {userProfile.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-l-4 transition ${isActive
                                                ? "bg-emerald-50 border-l-emerald-600 text-emerald-600"
                                                : "border-l-transparent hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        {activeTab === "profile" && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Hồ sơ cá nhân
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Quản lý thông tin hồ sơ để bảo vệ tài khoản
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {userProfile.avatar ? (
                                                <img
                                                    src={userProfile.avatar}
                                                    alt={userProfile.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                                                Chọn ảnh
                                            </button>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Tải lên hình ảnh của bạn
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Họ tên
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={userProfile.name}
                                                    disabled
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={userProfile.email}
                                                    disabled
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={userProfile.phone || "Chưa cập nhật"}
                                                    disabled
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày tham gia
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={
                                                        userProfile.createdAt
                                                            ? new Date(userProfile.createdAt).toLocaleDateString(
                                                                "vi-VN"
                                                            )
                                                            : "N/A"
                                                    }
                                                    disabled
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                                        <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition">
                                            Hủy
                                        </button>
                                        <button className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition">
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "address" && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                                Sẽ thêm tính năng quản lý địa chỉ
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                                Sẽ thêm danh sách đơn mua
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                                Sẽ thêm danh sách yêu thích
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
