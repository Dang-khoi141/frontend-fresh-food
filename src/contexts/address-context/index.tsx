"use client";

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { UserRole } from "@/lib/enums/user-role.enum";
import { Address, AddressContextType } from "../../lib/interface/address";
import { addressService } from "../../lib/service/address.service";

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;
    const isCustomer = userRole === UserRole.CUSTOMER || !userRole;

    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const loadDefaultAddress = useCallback(async () => {
        if (!session || !isCustomer) {
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
    }, [session, isCustomer, refreshKey]);

    useEffect(() => {
        loadDefaultAddress();
    }, [loadDefaultAddress]);

    const refreshAddress = useCallback(async () => {
        await loadDefaultAddress();
        setRefreshKey(prev => prev + 1);
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
