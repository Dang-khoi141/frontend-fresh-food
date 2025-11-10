"use client";

import { useEffect, useState } from "react";

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "../img/banner/hero-1.png",
      title: "Organic Fresh Fruits",
      subtitle: "For Your Health",
      description:
        "Interdum Et Malesuada Fames Ac Ante Ipsum Primis In Faucibus. Mauris Eleifend Sagittis Mollis, Nulla Finibus Arcu Eu Tortor Gravida Aliquet",
    },
    {
      id: 2,
      image: "../img/banner/hero-2.png",
      title: "Organic Fresh Fruits",
      subtitle: "For Your Health",
      description:
        "Interdum Et Malesuada Fames Ac Ante Ipsum Primis In Faucibus. Mauris Eleifend Sagittis Mollis, Nulla Finibus Arcu Eu Tortor Gravida Aliquet",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative bg-gray-50 pt-24 md:pt-32 pb-0 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative h-[420px] sm:h-[480px] md:h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-center h-full">
                {/* Left side - Image */}
                <div className="relative h-full flex items-center justify-center order-2 md:order-1 mt-4 md:mt-0">
                  <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px]">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden text-6xl sm:text-8xl md:text-9xl text-center">
                      {index === 0 ? "🍎🥝🍊" : "🥦🍍🥕"}
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="order-1 md:order-2 text-center md:text-left px-2 sm:px-0">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                    {slide.title}
                    <br />
                    <span className="text-gray-700">{slide.subtitle}</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
                    {slide.description}
                  </p>
                  <button className="bg-green-700 hover:bg-green-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-semibold inline-flex items-center gap-2 shadow-lg transition uppercase text-xs sm:text-sm">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? "bg-green-700 w-6 sm:w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
