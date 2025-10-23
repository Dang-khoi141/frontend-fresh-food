import { Address, AddressFormData } from "@/lib/interface/address";
import { District, Province, Ward } from "@/lib/interface/province";
import { addressService } from "@/lib/service/address.service";
import { provinceApiService } from "@/lib/service/province-api.service";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAddressContext } from "../../contexts/address-context";

const initialFormState: AddressFormData = {
  line1: "",
  provinceCode: 0,
  provinceName: "",
  districtCode: 0,
  districtName: "",
  wardCode: 0,
  wardName: "",
  isDefault: false,
};

export const useFetchAddress = (isAuthenticated: boolean) => {
  const { refreshAddress, defaultAddress: contextDefaultAddress } = useAddressContext();
  const refreshTriggerRef = useRef(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [addressForm, setAddressForm] =
    useState<AddressFormData>(initialFormState);

  const loadAddresses = useCallback(async () => {
    try {
      const data = await addressService.getAllAddresses();
      setAddresses(data);
    } catch (error: any) {
      if (error.response?.status !== 403) {
        console.error("Error loading addresses:", error);
      }
    }
  }, []);

  const loadDefaultAddress = useCallback(async () => {
    try {
      const data = await addressService.getDefaultAddress();
      setDefaultAddress(data);
    } catch (error: any) {
      if (error.response?.status !== 403) {
        console.error("Error loading default address:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
      loadDefaultAddress();
    }
  }, [isAuthenticated, loadAddresses, loadDefaultAddress]);

  useEffect(() => {
    if (isAuthenticated && contextDefaultAddress) {
      setDefaultAddress(contextDefaultAddress);
      loadAddresses();
    }
  }, [contextDefaultAddress, isAuthenticated, loadAddresses]);

  const loadProvinces = useCallback(async () => {
    if (provinces.length > 0) return;
    setLoadingProvinces(true);
    try {
      const data = await provinceApiService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      console.error("Error loading provinces:", error);
      alert("Không thể tải danh sách Tỉnh/Thành phố");
    } finally {
      setLoadingProvinces(false);
    }
  }, [provinces.length]);

  const loadDistricts = useCallback(async (provinceCode: number) => {
    setLoadingDistricts(true);
    try {
      const data = await provinceApiService.getDistrictsByProvince(
        provinceCode
      );
      setDistricts(data);
    } catch (error) {
      console.error("Error loading districts:", error);
      alert("Không thể tải danh sách Quận/Huyện");
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  const loadWards = useCallback(async (districtCode: number) => {
    setLoadingWards(true);
    try {
      const data = await provinceApiService.getWardsByDistrict(districtCode);
      setWards(data);
    } catch (error) {
      console.error("Error loading wards:", error);
      alert("Không thể tải danh sách Phường/Xã");
    } finally {
      setLoadingWards(false);
    }
  }, []);

  const handleProvinceChange = useCallback(
    (code: string) => {
      const provinceCode = parseInt(code);
      const province = provinces.find(p => p.code === provinceCode);

      setAddressForm(prev => ({
        ...prev,
        provinceCode,
        provinceName: province?.name || "",
        districtCode: 0,
        districtName: "",
        wardCode: 0,
        wardName: "",
      }));

      setDistricts([]);
      setWards([]);

      if (provinceCode > 0) loadDistricts(provinceCode);
    },
    [provinces, loadDistricts]
  );

  const handleDistrictChange = useCallback(
    (code: string) => {
      const districtCode = parseInt(code);
      const district = districts.find(d => d.code === districtCode);

      setAddressForm(prev => ({
        ...prev,
        districtCode,
        districtName: district?.name || "",
        wardCode: 0,
        wardName: "",
      }));

      setWards([]);

      if (districtCode > 0) loadWards(districtCode);
    },
    [districts, loadWards]
  );

  const handleWardChange = useCallback(
    (code: string) => {
      const wardCode = parseInt(code);
      const ward = wards.find(w => w.code === wardCode);

      setAddressForm(prev => ({
        ...prev,
        wardCode,
        wardName: ward?.name || "",
      }));
    },
    [wards]
  );

  const updateFormField = useCallback(
    <K extends keyof AddressFormData>(field: K, value: AddressFormData[K]) => {
      setAddressForm(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const createAddress = useCallback(
    async (manualAddress?: string) => {
      const finalLine1 =
        manualAddress !== undefined ? manualAddress.trim() : addressForm.line1;

      if (!finalLine1) {
        alert("Vui lòng điền hoặc chọn địa chỉ trước khi lưu");
        return false;
      }

      setLoadingAddress(true);
      try {
        const newAddress = await addressService.createAddress({
          line1: finalLine1,
          province: addressForm.provinceName || "",
          city: addressForm.districtName || "",
          country: "Vietnam",
          postalCode: addressForm.wardName || "",
          isDefault: true,
        });

        await loadAddresses();
        await loadDefaultAddress();
        await refreshAddress();
        resetForm();
        return true;
      } catch (error) {
        console.error("Error creating address:", error);
        alert("Không thể tạo địa chỉ. Vui lòng thử lại!");
        return false;
      } finally {
        setLoadingAddress(false);
      }
    },
    [addressForm, loadAddresses, loadDefaultAddress, refreshAddress]
  );

  const setAsDefaultAddress = useCallback(
    async (addressId: string) => {
      try {
        await addressService.setDefaultAddress(addressId);
        await loadAddresses();
        await loadDefaultAddress();
        await refreshAddress();
        return true;
      } catch (error) {
        console.error("Error setting default address:", error);
        alert("Không thể đặt địa chỉ mặc định. Vui lòng thử lại!");
        return false;
      }
    },
    [loadAddresses, loadDefaultAddress, refreshAddress]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return false;

      try {
        await addressService.deleteAddress(addressId);
        await loadAddresses();
        await loadDefaultAddress();
        await refreshAddress();
        return true;
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Không thể xóa địa chỉ. Vui lòng thử lại!");
        return false;
      }
    },
    [loadAddresses, loadDefaultAddress, refreshAddress]
  );

  const resetForm = useCallback(() => {
    setAddressForm(initialFormState);
    setDistricts([]);
    setWards([]);
  }, []);

  const getDisplayAddress = useCallback(() => {
    if (!defaultAddress) return "Chọn vị trí giao hàng";

    const { city, province } = defaultAddress;
    if (city && province) return `${city}, ${province}`;
    if (city) return city;
    if (province) return province;
    return "Chọn vị trí giao hàng";
  }, [defaultAddress]);

  return {
    addresses,
    defaultAddress,
    loadingAddress,

    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,

    addressForm,
    loadProvinces,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    updateFormField,

    createAddress,
    setAsDefaultAddress,
    deleteAddress,
    resetForm,
    getDisplayAddress,
    refreshAddresses: loadAddresses,
  };
};