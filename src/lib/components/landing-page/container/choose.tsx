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
    <div className="w-full flex justify-center items-center bg-white py-16">
      <div className="w-full max-w-7xl flex flex-col justify-center items-center gap-8 px-4">
        <div className="flex flex-col justify-center items-center gap-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Why Choose FreshMart?
          </h1>
          <h2 className="font-normal text-lg md:text-xl text-gray-600 max-w-3xl">
            Discover the features that make our platform stand out from the
            competition
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-8">
            <Leaf className="w-16 h-16 text-emerald-600 mb-4" />
            <h2 className="font-bold text-xl text-gray-900 mb-3 text-center">
              Locally Sourced
            </h2>
            <span className="font-normal text-gray-600 text-center">
              We partner with local farms to bring you the freshest produce while supporting your community
            </span>
          </div>

          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-8">
            <Clock className="w-16 h-16 text-emerald-600 mb-4" />
            <h2 className="text-center font-bold text-xl text-gray-900 mb-3">
              Fast Delivery
            </h2>
            <span className="font-normal text-gray-600 text-center">
              Get your groceries delivered in under 2 hours with our express delivery service
            </span>
          </div>

          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-8">
            <Shield className="w-16 h-16 text-emerald-600 mb-4" />
            <h2 className="text-center font-bold text-xl text-gray-900 mb-3">
              Quality Guaranteed
            </h2>
            <span className="font-normal text-gray-600 text-center">
              Every item is hand-picked and quality checked before it reaches your door
            </span>
          </div>

          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-8">
            <HeartPulse className="w-16 h-16 text-emerald-600 mb-4" />
            <h2 className="text-center font-bold text-xl text-gray-900 mb-3">
              Health Focused
            </h2>
            <span className="font-normal text-gray-600 text-center">
              Organic, non-GMO, and pesticide-free options to keep your family healthy
            </span>
          </div>

          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-8">
            <Truck className="w-16 h-16 text-emerald-600 mb-4" />
            <h2 className="text-center font-bold text-xl text-gray-900 mb-3">
              Free Delivery
            </h2>
            <span className="font-normal text-gray-600 text-center">
              Enjoy free delivery on orders over $50. No hidden fees, no surprises
            </span>
          </div>

          <div className="cursor-pointer flex flex-col justify-center rounded-2xl shadow-lg hover:shadow-xl transition items-center bg-white p-8">
            <Award className="w-16 h-16 text-emerald-600 mb-4" />
            <h2 className="text-center font-bold text-xl text-gray-900 mb-3">
              Award Winning
            </h2>
            <span className="font-normal text-gray-600 text-center">
              Recognized as the #1 grocery delivery service in customer satisfaction
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
