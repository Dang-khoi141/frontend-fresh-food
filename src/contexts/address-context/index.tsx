"use client";

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from "react";
import { Address, addressService } from "@/lib/service/address.service";
import { useSession } from "next-auth/react";

interface AddressContextType {
    defaultAddress: Address | null;
    refreshAddress: () => Promise<void>;
    isLoading: boolean;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadDefaultAddress = useCallback(async () => {
        if (!session) {
            setDefaultAddress(null);
            return;
        }

        setIsLoading(true);
        try {
            const data = await addressService.getDefaultAddress();
            setDefaultAddress(data);
        } catch (error) {
            console.error("Error loading default address:", error);
            setDefaultAddress(null);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        loadDefaultAddress();
    }, [loadDefaultAddress]);

    const refreshAddress = useCallback(async () => {
        await loadDefaultAddress();
    }, [loadDefaultAddress]);

    return (
        <AddressContext.Provider
            value={{
                defaultAddress,
                refreshAddress,
                isLoading
            }}
        >
            {children}
        </AddressContext.Provider>
    );
}

export function useAddressContext() {
    const context = useContext(AddressContext);
    if (context === undefined) {
        throw new Error("useAddressContext must be used within AddressProvider");
    }
    return context;
}
