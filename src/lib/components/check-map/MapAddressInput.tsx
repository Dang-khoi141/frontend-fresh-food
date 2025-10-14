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
    const [detecting, setDetecting] = useState(false);
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

    useEffect(() => {
        if ("geolocation" in navigator) {
            setDetecting(true);
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCoords([longitude, latitude]);

                    if (mapRef.current) {
                        mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
                    }

                    if (markerRef.current) markerRef.current.remove();
                    markerRef.current = new maplibregl.Marker()
                        .setLngLat([longitude, latitude])
                        .addTo(mapRef.current!);

                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await res.json();
                        const detected =
                            data.display_name ||
                            `${data.address.road || ""}, ${data.address.city || ""}, ${data.address.state || ""
                            }`;
                        setQuery(detected);
                        onAddressChange(detected);
                    } catch (e: any) {
                        if (e.name !== "AbortError")
                            console.error("Reverse geocode failed:", e);
                    } finally {
                        setDetecting(false);
                    }
                },
                (err) => {
                    console.warn("Không thể lấy vị trí:", err.message);
                    setDetecting(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.warn("Trình duyệt không hỗ trợ geolocation");
        }
    }, []);

    const handleSearch = (text: string) => {
        setQuery(text);
        setSuggestions([]);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        if (text.trim().length < 3) return;

        debounceRef.current = setTimeout(async () => {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        text
                    )}`,
                    { signal }
                );
                const data = await res.json();
                setSuggestions(data.slice(0, 5));
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Fetch search failed:", err);
                }
            }
        }, 300);
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

    const handleGetCurrentLocation = async () => {
        if (!("geolocation" in navigator)) {
            alert("Trình duyệt của bạn không hỗ trợ định vị vị trí");
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setCoords([longitude, latitude]);

                if (mapRef.current) {
                    mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
                }

                if (markerRef.current) markerRef.current.remove();
                markerRef.current = new maplibregl.Marker()
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current!);

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const detected =
                        data.display_name ||
                        `${data.address.road || ""}, ${data.address.city || ""}, ${data.address.state || ""
                        }`;
                    setQuery(detected);
                    onAddressChange(detected);
                } catch (e: any) {
                    if (e.name !== "AbortError")
                        console.error("Reverse geocode failed:", e);
                } finally {
                    setDetecting(false);
                }
            },
            (err) => {
                console.warn("Không thể lấy vị trí:", err.message);
                setDetecting(false);
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Nhập địa chỉ..."
                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border mt-1 w-full rounded-lg shadow-md">
                        {suggestions.map((s) => (
                            <li
                                key={s.place_id}
                                onClick={() => handleSelect(s)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                                {s.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={handleGetCurrentLocation}
                disabled={detecting}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md disabled:opacity-50"
            >
                {detecting ? "Đang lấy vị trí..." : "Lấy vị trí hiện tại"}
            </button>

            <div ref={mapContainer} className="w-full h-64 rounded-lg border" />

            {coords && (
                <p className="text-xs text-gray-600">
                    Vĩ độ: {coords[1].toFixed(5)} • Kinh độ: {coords[0].toFixed(5)}
                </p>
            )}
        </div>
    );
}
