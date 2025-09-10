import { ArrowRight } from "lucide-react";

const Header = () => {
  return (
    <section className="z-10 relative isolate flex min-h-[85vh] w-full items-center justify-center overflow-hidden pt-28 md:pt-0">
      <div className="absolute inset-0 z-0 bg-avatar_bg bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 z-10 bg-gradient_hero" />

      <div className="z-20 mx-auto flex flex-col w-full max-w-6xl items-center px-4 text-center">
        <div className="mb-6">
          <h1 className="font-bold tracking-tight leading-[1.05] text-white sm:text-xl md:text-8xl">
            Fresh Food
          </h1>
          <h1 className="font-bold tracking-tight leading-[1.05] text-brand text-6xl md:text-8xl drop-shadow">
            Delivered Fast
          </h1>
        </div>

        <p className="mb-10 max-w-3xl text-base md:text-lg text-white/90">
          Experience the best in quality and convenience. Farm-fresh ingredients delivered to your door in under 2 hours.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 font-semibold text-white shadow-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>

          <button className="inline-flex items-center justify-center rounded-xl border border-white/80 bg-transparent px-6 py-3 font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Header;
