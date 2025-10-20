import { District, Province, Ward } from "./province";

export interface Address {
  id: string;
  line1: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  line1: string;
  city: string;
  province: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  line1?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface AddressFormData {
  line1: string;
  provinceCode: number;
  provinceName: string;
  districtCode: number;
  districtName: string;
  wardCode: number;
  wardName: string;
  isDefault: boolean;
}

export interface AddressContextType {
  defaultAddress: Address | null;
  refreshAddress: () => Promise<void>;
  isLoading: boolean;
}

export interface AddressCardProps {
  address: Address;
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
}

export interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressForm: AddressFormData;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  loadingProvinces: boolean;
  loadingDistricts: boolean;
  loadingWards: boolean;
  onProvinceChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
  onWardChange: (code: string) => void;
  onFieldChange: (field: keyof AddressFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export interface AddressListSectionProps {
  addresses: Address[];
  onAddNew: () => void;
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
}
