"use client";

import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

type Props = {
    onAddressChange: (address: string) => void;
    address: string;
};

export default function MapAddressInput({ onAddressChange, address }: Props) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [query, setQuery] = useState(address);
    const [coords, setCoords] = useState<[number, number] | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
            center: [106.660172, 10.762622],
            zoom: 12,
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    const handleSearch = (text: string) => {
        setQuery(text);
        onAddressChange(text);
        setSuggestions([]);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        if (text.trim().length < 3) {
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        debounceRef.current = setTimeout(async () => {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;

            try {
                const res = await fetch(
                    `/api/geocode?q=${encodeURIComponent(text)}`,
                    { signal }
                );

                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }

                const data = await res.json();
                setSuggestions(data.slice(0, 5));
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Fetch search failed:", err);
                }
            } finally {
                setIsSearching(false);
            }
        }, 800);
    };

    const handleSelect = (item: any) => {
        setQuery(item.display_name);
        onAddressChange(item.display_name);
        setSuggestions([]);

        const lng = parseFloat(item.lon);
        const lat = parseFloat(item.lat);
        setCoords([lng, lat]);

        if (mapRef.current) {
            mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
        }

        if (markerRef.current) markerRef.current.remove();
        markerRef.current = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);
    };

    return (
        <div className="space-y-2 md:space-y-3">
            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Nhập địa chỉ..."
                    className="w-full border rounded-lg p-2.5 md:p-3 text-xs md:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {isSearching && (
                    <div className="absolute right-2 md:right-3 top-2.5 md:top-3">
                        <div className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                    </div>
                )}
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border mt-1 w-full rounded-lg shadow-md max-h-48 md:max-h-60 overflow-y-auto">
                        {suggestions.map((s) => (
                            <li
                                key={s.place_id}
                                onClick={() => handleSelect(s)}
                                className="px-2.5 md:px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs md:text-sm border-b last:border-b-0"
                            >
                                {s.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div ref={mapContainer} className="w-full h-48 md:h-64 rounded-lg border" />

            {coords && (
                <p className="text-[10px] md:text-xs text-gray-600">
                    Vị trí: {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
                </p>
            )}
        </div>
    );
}
