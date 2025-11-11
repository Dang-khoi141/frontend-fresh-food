import { ShoppingBag, User, Lock } from "lucide-react";
import { ProfileSidebarProps } from "../../../interface/user";

const MENU_ITEMS = [
    { id: "profile", label: "Hồ Sơ Người Dùng", icon: User },
    { id: "password", label: "Đổi Mật Khẩu", icon: Lock },
    { id: "orders", label: "Đơn Mua", icon: ShoppingBag },
] as const;

export type TabId = typeof MENU_ITEMS[number]["id"];

export default function ProfileSidebar({
    activeTab,
    onTabChange,
    userName,
    userEmail,
    userAvatar,
}: ProfileSidebarProps) {
    return (
        <aside className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded shadow-sm">
                <div className="hidden lg:block p-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {userAvatar ? (
                                <img
                                    src={userAvatar}
                                    alt={userName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">
                                {userName}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                {userEmail}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="py-2 lg:py-2">
                    <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-hide px-2 lg:px-0 gap-2 lg:gap-0">
                        {MENU_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onTabChange(item.id)}
                                    className={`flex-shrink-0 lg:flex-shrink flex items-center gap-2 lg:gap-3 px-4 lg:px-5 py-2.5 lg:py-3 text-left transition text-xs lg:text-sm rounded-lg lg:rounded-none whitespace-nowrap lg:whitespace-normal w-auto lg:w-full ${isActive
                                            ? "text-white bg-emerald-600 lg:text-emerald-600 lg:bg-emerald-50"
                                            : "text-gray-700 bg-gray-100 lg:bg-transparent hover:bg-gray-200 lg:hover:bg-gray-50 hover:text-emerald-600"
                                        }`}
                                >
                                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                                    <span className="font-medium lg:font-normal">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </aside>
    );
}
