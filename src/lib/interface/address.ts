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
