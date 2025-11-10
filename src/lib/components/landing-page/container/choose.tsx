import {
  Award,
  Clock,
  HeartPulse,
  Leaf,
  Shield,
  Truck,
} from "lucide-react";

const Choose = () => {
  return (
    <div className="w-full flex justify-center items-center bg-white py-10 sm:py-16 px-4">
      <div className="w-full max-w-7xl flex flex-col justify-center items-center gap-6 sm:gap-8">
        {/* Tiêu đề */}
        <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
            Why Choose FreshMart?
          </h1>
          <h2 className="font-normal text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl sm:max-w-3xl">
            Discover the features that make our platform stand out from the
            competition
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full mt-8">
          {/* Item 1 */}
          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-6 sm:p-8 text-center">
            <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mb-4" />
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">
              Locally Sourced
            </h2>
            <span className="font-normal text-sm sm:text-base text-gray-600">
              We partner with local farms to bring you the freshest produce while supporting your community
            </span>
          </div>

          {/* Item 2 */}
          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-6 sm:p-8 text-center">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mb-4" />
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">
              Fast Delivery
            </h2>
            <span className="font-normal text-sm sm:text-base text-gray-600">
              Get your groceries delivered in under 2 hours with our express delivery service
            </span>
          </div>

          {/* Item 3 */}
          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-6 sm:p-8 text-center">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mb-4" />
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">
              Quality Guaranteed
            </h2>
            <span className="font-normal text-sm sm:text-base text-gray-600">
              Every item is hand-picked and quality checked before it reaches your door
            </span>
          </div>

          {/* Item 4 */}
          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-6 sm:p-8 text-center">
            <HeartPulse className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mb-4" />
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">
              Health Focused
            </h2>
            <span className="font-normal text-sm sm:text-base text-gray-600">
              Organic, non-GMO, and pesticide-free options to keep your family healthy
            </span>
          </div>

          {/* Item 5 */}
          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-6 sm:p-8 text-center">
            <Truck className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mb-4" />
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">
              Free Delivery
            </h2>
            <span className="font-normal text-sm sm:text-base text-gray-600">
              Enjoy free delivery on orders over $50. No hidden fees, no surprises
            </span>
          </div>

          {/* Item 6 */}
          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-6 sm:p-8 text-center">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mb-4" />
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">
              Award Winning
            </h2>
            <span className="font-normal text-sm sm:text-base text-gray-600">
              Recognized as the #1 grocery delivery service in customer satisfaction
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
