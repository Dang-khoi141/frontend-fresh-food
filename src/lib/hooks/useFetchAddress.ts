import { useState, useEffect, useCallback } from "react";
import { addressService, Address } from "@/lib/service/address.service";
import {
  District,
  Province,
  Ward,
  provinceApiService,
} from "../service/province-api.service";

interface AddressFormData {
  line1: string;
  provinceCode: number;
  provinceName: string;
  districtCode: number;
  districtName: string;
  wardCode: number;
  wardName: string;
  isDefault: boolean;
}

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

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
      loadDefaultAddress();
    }
  }, [isAuthenticated]);

  const loadAddresses = useCallback(async () => {
    try {
      const data = await addressService.getAllAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  }, []);

  const loadDefaultAddress = useCallback(async () => {
    try {
      const data = await addressService.getDefaultAddress();
      setDefaultAddress(data);
    } catch (error) {
      console.error("Error loading default address:", error);
    }
  }, []);

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

  const createAddress = useCallback(async () => {
    if (
      !addressForm.line1 ||
      !addressForm.provinceCode ||
      !addressForm.districtCode ||
      !addressForm.wardCode
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return false;
    }

    setLoadingAddress(true);
    try {
      await addressService.createAddress({
        line1: addressForm.line1,
        province: addressForm.provinceName,
        city: addressForm.districtName,
        country: "Vietnam",
        postalCode: addressForm.wardName,
        isDefault: addressForm.isDefault,
      });
      await loadAddresses();
      await loadDefaultAddress();
      resetForm();
      return true;
    } catch (error) {
      console.error("Error creating address:", error);
      alert("Không thể tạo địa chỉ. Vui lòng thử lại!");
      return false;
    } finally {
      setLoadingAddress(false);
    }
  }, [addressForm, loadAddresses, loadDefaultAddress]);

  const setAsDefaultAddress = useCallback(
    async (addressId: string) => {
      try {
        await addressService.setDefaultAddress(addressId);
        await loadAddresses();
        await loadDefaultAddress();
        return true;
      } catch (error) {
        console.error("Error setting default address:", error);
        alert("Không thể đặt địa chỉ mặc định. Vui lòng thử lại!");
        return false;
      }
    },
    [loadAddresses, loadDefaultAddress]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return false;

      try {
        await addressService.deleteAddress(addressId);
        await loadAddresses();
        await loadDefaultAddress();
        return true;
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Không thể xóa địa chỉ. Vui lòng thử lại!");
        return false;
      }
    },
    [loadAddresses, loadDefaultAddress]
  );

  const resetForm = useCallback(() => {
    setAddressForm(initialFormState);
    setDistricts([]);
    setWards([]);
  }, []);

  const getDisplayAddress = useCallback(() => {
    if (!defaultAddress) return "Chọn địa chỉ giao hàng";
    return `${defaultAddress.city}, ${defaultAddress.province}`;
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
