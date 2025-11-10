"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBannerTracking, useFetchHeroSliderBanners } from "../../../hooks/useFetchBanner";

const HeroSlider = () => {
  const { banners, loading } = useFetchHeroSliderBanners();
  const { trackView, trackClick } = useBannerTracking();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (banners[currentIndex]?.id) trackView(banners[currentIndex].id);
  }, [currentIndex, banners, trackView]);

  const handleClick = (banner: any) => {
    trackClick(banner.id);
    if (banner.linkUrl) window.location.href = banner.linkUrl;
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading)
    return <section className="relative w-full h-[360px] bg-gray-100 animate-pulse" />;

  const currentBanner = banners[currentIndex];

  return (
    <section className="bg-gray-50 py-4 mt-32 z-0">
      <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-md relative z-0">
        <div className="relative w-full h-[360px] md:h-[340px]">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 cursor-pointer z-0"
              onClick={() => handleClick(currentBanner)}
            >
              <Image
                src={currentBanner.imageUrl}
                alt="Banner"
                fill
                className="object-contain object-center w-full h-full"
              />
            </motion.div>
          </AnimatePresence>

          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((p) => (p === 0 ? banners.length - 1 : p - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentIndex((p) => (p + 1) % banners.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 rounded-full ${i === currentIndex
                    ? "bg-green-600 w-4 h-4 scale-110 shadow-md"
                    : "bg-green-300 w-3 h-3 hover:bg-green-500"
                    }`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>

  );
};

export default HeroSlider;
