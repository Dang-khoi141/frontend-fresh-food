'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InventoriesPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/inventories/warehouse/management');
    }, [router]);

    return null;
}
