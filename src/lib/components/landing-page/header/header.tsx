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
      description: "Interdum Et Malesuada Fames Ac Ante Ipsum Primis In Faucibus. Mauris Eleifend Sagittis Mollis, Nulla Finibus Arcu Eu Tortor Gravida Aliquet",
    },
    {
      id: 2,
      image: "../img/banner/hero-2.png",
      title: "Organic Fresh Fruits",
      subtitle: "For Your Health",
      description: "Interdum Et Malesuada Fames Ac Ante Ipsum Primis In Faucibus. Mauris Eleifend Sagittis Mollis, Nulla Finibus Arcu Eu Tortor Gravida Aliquet",
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
    <section className="relative bg-gray-50 pt-32 pb-0 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative h-[500px] md:h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-12 items-center h-full">
                {/* Left side - Image */}
                <div className="relative h-full flex items-center justify-center order-2 md:order-1">
                  <div className="relative w-full h-[400px] md:h-[500px]">
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
                    <div className="hidden text-9xl text-center">
                      {index === 0 ? "🍎🥝🍊" : "🥦🍍🥕"}
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="order-1 md:order-2 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                    {slide.title}
                    <br />
                    <span className="text-gray-700">{slide.subtitle}</span>
                  </h1>
                  <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl">
                    {slide.description}
                  </p>
                  <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-md font-semibold inline-flex items-center gap-2 shadow-lg transition uppercase text-sm">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-green-700 w-8"
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
