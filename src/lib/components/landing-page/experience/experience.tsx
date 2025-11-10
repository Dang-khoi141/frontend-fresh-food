import { ArrowRight, Gift } from "lucide-react";

const Experience = () => {
  return (
    <section className="w-full bg-brand text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="min-h-[80vh] sm:min-h-screen flex items-center justify-center text-center py-16 sm:py-20">
          <div className="w-full">
            {/* Tag khuyến mãi */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ring-1 ring-white/20">
              <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Limited Time Offer</span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="mt-5 sm:mt-6 font-extrabold tracking-tight text-3xl sm:text-5xl md:text-7xl leading-snug sm:leading-tight">
              Get
              <span className="block text-sale_mobi lg:text-sale">50%</span>
              <span className="block text-h1_title_mobi lg:text-h1_title">
                Off Your First Order
              </span>
            </h1>

            {/* Đoạn mô tả */}
            <p className="mx-auto mt-4 sm:mt-6 max-w-md sm:max-w-2xl md:max-w-4xl text-sm sm:text-lg md:text-2xl text-white/90 px-2 sm:px-0">
              Join thousands of happy customers and experience the FreshMart difference. Use code{" "}
              <span className="inline-block rounded-md bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 font-bold">
                FRESH50
              </span>{" "}
              at checkout.
            </p>

            {/* Nút CTA */}
            <div className="mt-8 sm:mt-10">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm md:text-base font-semibold text-brand shadow-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand transition"
              >
                Start Shopping Now
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Chú thích nhỏ */}
            <p className="mt-5 sm:mt-6 text-[10px] sm:text-xs md:text-sm text-white/80 px-3 sm:px-0">
              Free delivery on orders over $50 • No commitment • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
