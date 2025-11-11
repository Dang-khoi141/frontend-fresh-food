import { useState } from "react";
import MapAddressInput from './../check-map/MapAddressInput';
import { useAddressContext } from "../../../contexts/address-context";

export default function ShippingAddressSection({
  defaultAddress,
  createAddress,
  shippingAddress,
  setShippingAddress,
}: {
  defaultAddress: any;
  createAddress: (manualAddress?: string) => Promise<boolean>;
  shippingAddress: string;
  setShippingAddress: (v: string) => void;
}) {
  const [showMap, setShowMap] = useState(false);
  const { refreshAddress } = useAddressContext();

  const hasDefaultAddress =
    defaultAddress &&
    (defaultAddress.line1?.trim() ||
      defaultAddress.city?.trim() ||
      defaultAddress.province?.trim());

  const handleSaveAddress = async () => {
    if (!shippingAddress || !shippingAddress.trim()) {
      alert("Vui lòng nhập địa chỉ trước khi lưu!");
      return;
    }

    const success = await createAddress(shippingAddress);

    if (success) {
      await refreshAddress();
      alert("Đã lưu địa chỉ mặc định thành công!");
      setShowMap(false);
    }
  };

  if (!hasDefaultAddress || showMap) {
    return (
      <div>
        <p className="text-xs md:text-sm text-gray-600 mb-2">
          {!shippingAddress
            ? "Bạn chưa chọn địa chỉ giao hàng. Hãy chọn hoặc cho phép lấy vị trí hiện tại:"
            : "Địa chỉ gợi ý theo vị trí hiện tại:"}
        </p>

        <div className="border rounded-lg bg-white p-2 md:p-3">
          <MapAddressInput
            address={shippingAddress}
            onAddressChange={(value) => setShippingAddress(value)}
          />

          <div className="flex gap-2 mt-2 md:mt-3">
            <button
              onClick={handleSaveAddress}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition-colors"
            >
              Lưu làm địa chỉ mặc định
            </button>

            {hasDefaultAddress && (
              <button
                onClick={() => setShowMap(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition-colors"
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-3 border rounded-lg bg-white">
      <p className="text-xs md:text-sm text-gray-700 font-medium">
        {[defaultAddress.line1, defaultAddress.city, defaultAddress.province]
          .filter((part) => part && part.trim() !== "")
          .join(", ")}
      </p>

      <p className="text-[10px] md:text-xs text-gray-500 mt-1">(Địa chỉ mặc định của bạn)</p>
      <button
        onClick={() => setShowMap(true)}
        className="mt-2 text-emerald-600 hover:text-emerald-700 hover:underline text-xs md:text-sm font-medium transition-colors"
      >
        Chọn địa chỉ khác
      </button>
    </div>
  );
}
