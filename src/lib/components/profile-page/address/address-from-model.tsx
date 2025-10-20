"use client";

import { X } from "lucide-react";
import { AddressFormModalProps } from "../../../interface/address";

export default function AddressFormModal({
    isOpen,
    onClose,
    addressForm,
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
    onFieldChange,
    onSubmit,
    isLoading,
}: AddressFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Thêm địa chỉ mới</h3>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={addressForm.provinceCode || ""}
                            onChange={(e) => onProvinceChange(e.target.value)}
                            disabled={loadingProvinces}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {loadingProvinces ? "Đang tải..." : "Chọn Tỉnh/Thành phố"}
                            </option>
                            {provinces.map((p) => (
                                <option key={p.code} value={p.code}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={addressForm.districtCode || ""}
                            onChange={(e) => onDistrictChange(e.target.value)}
                            disabled={!addressForm.provinceCode || loadingDistricts}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {loadingDistricts
                                    ? "Đang tải..."
                                    : addressForm.provinceCode
                                        ? "Chọn Quận/Huyện"
                                        : "Vui lòng chọn Tỉnh/Thành phố trước"}
                            </option>
                            {districts.map((d) => (
                                <option key={d.code} value={d.code}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phường/Xã <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={addressForm.wardCode || ""}
                            onChange={(e) => onWardChange(e.target.value)}
                            disabled={!addressForm.districtCode || loadingWards}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {loadingWards
                                    ? "Đang tải..."
                                    : addressForm.districtCode
                                        ? "Chọn Phường/Xã"
                                        : "Vui lòng chọn Quận/Huyện trước"}
                            </option>
                            {wards.map((w) => (
                                <option key={w.code} value={w.code}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Địa chỉ chi tiết <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={addressForm.line1}
                            onChange={(e) => onFieldChange("line1", e.target.value)}
                            placeholder="Số nhà, tên đường..."
                            rows={3}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) => onFieldChange("isDefault", e.target.checked)}
                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <label
                            htmlFor="isDefault"
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Đặt làm địa chỉ mặc định
                        </label>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onSubmit}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Đang lưu..." : "Lưu địa chỉ"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
