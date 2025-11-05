"use client";

import { useCallback, useEffect, useState } from "react";
import { Banner } from "../interface/banner";
import { bannerService } from "../service/banner.service";

export function useFetchHeroSliderBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bannerService.getHeroSlider();
      setBanners(data);
    } catch (err) {
      setError(err as Error);
      console.error("❌ Lỗi khi tải banners:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    const interval = setInterval(fetchBanners, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchBanners]);

  return { banners, loading, error };
}

export function useBannerTracking() {
  const trackView = useCallback(async (id: string) => {
    try {
      await bannerService.trackView(id);
    } catch (err) {
      console.warn("Lỗi ghi nhận view:", err);
    }
  }, []);

  const trackClick = useCallback(async (id: string) => {
    try {
      await bannerService.trackClick(id);
    } catch (err) {
      console.warn("Lỗi ghi nhận click:", err);
    }
  }, []);

  return { trackView, trackClick };
}
