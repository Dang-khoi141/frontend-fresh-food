import { ArrowRight, Gift } from "lucide-react";

const Experience = () => {
  return (
    <section className="w-full bg-brand text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="min-h-screen flex items-center justify-center text-center py-20">
          <div className="w-full">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20">
              <Gift className="h-4 w-4" />
              <span>Limited Time Offer</span>
            </div>

            <h1 className="mt-6 font-extrabold tracking-tight text-4xl sm:text-5xl md:text-7xl leading-tight">
              Get
              <span className="block text-sale_mobi lg:text-sale">50%</span>
              <span className="block text-h1_title_mobi lg:text-h1_title">Off Your First Order</span>
            </h1>

            <p className="mx-auto mt-6 max-w-4xl text-base sm:text-lg md:text-2xl text-white/90">
              Join thousands of happy customers and experience the FreshMart difference. Use code{" "}
              <span className="inline-block rounded-md bg-white/10 px-3 py-1 font-bold">
                FRESH50
              </span>{" "}
              at checkout.
            </p>

            <div className="mt-10">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm md:text-base font-semibold text-brand shadow-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand"
              >
                Start Shopping Now
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-6 text-xs md:text-sm text-white/80">
              Free delivery on orders over $50 • No commitment • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Experience;
