"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { addressService } from "@/lib/service/address.service";
import { Address } from "@/lib/service/address.service";

interface AddressContextType {
    defaultAddress: Address | null;
    refreshAddress: () => Promise<void>;
    setDefaultAddress: (addr: Address) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);

    const refreshAddress = async () => {
        try {
            const res = await addressService.getDefaultAddress();
            setDefaultAddress(res);
        } catch (err) {
            console.error("Không thể tải địa chỉ mặc định:", err);
        }
    };

    useEffect(() => {
        refreshAddress();
    }, []);

    return (
        <AddressContext.Provider value={{ defaultAddress, refreshAddress, setDefaultAddress }}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddressContext = () => {
    const ctx = useContext(AddressContext);
    if (!ctx) throw new Error("useAddressContext must be used within AddressProvider");
    return ctx;
};
