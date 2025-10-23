import { User } from "lucide-react";
import { UserProfileFormProps } from "../../../interface/user";

export default function UserProfileForm({
    formData,
    formErrors,
    message,
    isSaving,
    isUploadingAvatar,
    onInputChange,
    onAvatarUpload,
    onSubmit,
}: UserProfileFormProps) {
    return (
        <div className="bg-white rounded shadow-sm">
            <div className="px-7 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Hồ Sơ Của Tôi</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
            </div>

            <form onSubmit={onSubmit} className="p-7">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="flex items-start">
                            <label className="w-36 text-sm text-gray-600 text-right pt-2 pr-5">
                                Tên
                            </label>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onInputChange}
                                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-emerald-500 ${formErrors.name ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <label className="w-36 text-sm text-gray-600 text-right pt-2 pr-5">
                                Email
                            </label>
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={onInputChange}
                                    className={`flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-emerald-500 ${formErrors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <label className="w-36 text-sm text-gray-600 text-right pt-2 pr-5">
                                Số điện thoại
                            </label>
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={onInputChange}
                                    placeholder="Thêm số điện thoại"
                                    className={`flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-emerald-500 ${formErrors.phone ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-36"></div>
                            <div className="flex-1">
                                <button
                                    type="submit"
                                    disabled={isSaving || isUploadingAvatar}
                                    className="px-8 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 flex flex-col items-center border-l border-gray-200 pl-8">
                        <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
                            {formData.avatar ? (
                                <img
                                    src={`${formData.avatar}?t=${Date.now()}`}
                                    alt={formData.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-14 w-14 text-gray-400" />
                            )}
                        </div>
                        <label className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition cursor-pointer">
                            {isUploadingAvatar ? "Đang tải lên..." : "Chọn Ảnh"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onAvatarUpload}
                                disabled={isUploadingAvatar}
                                className="hidden"
                            />
                        </label>
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">Dung lượng file tối đa 1 MB</p>
                            <p className="text-xs text-gray-500">Định dạng: .JPEG, .PNG</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
