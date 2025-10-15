import {
  Address,
  CreateAddressDto,
  UpdateAddressDto,
} from "../interface/address";
import { BaseApiService } from "./baseApi.service";

class AddressService extends BaseApiService {
  async getAllAddresses(): Promise<Address[]> {
    const res = await this.axiosInstance.get("/addresses");
    return res.data?.data ?? res.data;
  }

  async getDefaultAddress(): Promise<Address | null> {
    try {
      const res = await this.axiosInstance.get("/addresses/default");
      return res.data?.data ?? res.data;
    } catch (error) {
      return null;
    }
  }

  async createAddress(dto: CreateAddressDto): Promise<Address> {
    const res = await this.axiosInstance.post("/addresses", dto);
    return res.data?.data ?? res.data;
  }

  async updateAddress(id: string, dto: UpdateAddressDto): Promise<Address> {
    const res = await this.axiosInstance.patch(`/addresses/${id}`, dto);
    return res.data?.data ?? res.data;
  }

  async deleteAddress(id: string): Promise<void> {
    await this.axiosInstance.delete(`/addresses/${id}`);
  }

  async setDefaultAddress(id: string): Promise<Address> {
    const res = await this.axiosInstance.patch(`/addresses/${id}/default`);
    return res.data?.data ?? res.data;
  }
}

export const addressService = new AddressService();
