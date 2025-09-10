import {
  Award,
  ChartLine,
  Clock,
  Grid2X2Icon,
  HeartPulse,
  Leaf,
  MessagesSquare,
  Shield,
  Truck,
} from "lucide-react";

const Choose = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center gap-6 md:gap-choose my-15 md:my-20">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-h1_title_mobi font-bold md:text-h1_title">
            Why Choose FreshMarth?
          </h1>
          <h2 className=" text-center font-inter font-normal text-h2_container_mobi md:text-h2_box">
            Discover the features that make our platform stand out from the
            competition
          </h2>
        </div>
        <div className="grid md:grid-cols-3 grid-rows-2 mb-exper_box gap-6 md:gap-10 ">
          <div className="cursor-pointer flex flex-col justify-center rounded-box shadow-sl items-center w-full max-w-box_max_mobi md:max-w-box_max h-40 md:h-72">
            <Leaf className="w-20 h-14 text-purple mb-3 mt-6" />
            <h2 className="font-inter font-bold text-h2_container_mobi tracking-ls md:text-h2_box sm:px-4 text-center">
              Locally Sourced
            </h2>
            <span className="font-inter font-normal mb-5 sm:mb-0 px-6 sm:px-8 text-span_mobi md:text-span text-center">
              We partner with local farms to bring you the freshest produce while supporting your community
            </span>
          </div>
          <div className=" cursor-pointer flex flex-col justify-center rounded-box shadow-sl items-center w-full max-w-box_max_mobi md:max-w-box_max h-40 md:h-72">
            <Clock className="w-14 h-14 text-purple mb-3 mt-6" />
            <h2 className="text-center font-inter font-bold text-h2_container_mobi tracking-ls md:text-h2_box">
              Fast Delivery
            </h2>
            <span className="font-inter font-normal mb-5 sm:mb-0 px-6 sm:px-9 text-span_mobi md:text-span text-center">
             Get your groceries delivered in under 2 hours with our express delivery service.
            </span>
          </div>
          <div className=" cursor-pointer flex flex-col justify-center rounded-box shadow-sl items-center w-full max-w-box_max_mobi md:max-w-box_max h-40 md:h-72">
            <Shield className="w-14 h-14 text-purple mb-3 mt-6" />
            <h2 className="text-center font-inter font-bold text-h2_container_mobi tracking-ls md:text-h2_box">
              Quality Guaranteed 
            </h2>
            <span className="font-inter font-normal mb-5 sm:mb-0 px-6 sm:px-9 text-span_mobi md:text-span text-center">
              Every item is hand-picked and quality checked before it reaches your door.
            </span>
          </div>
          <div className="cursor-pointer flex flex-col justify-center rounded-box shadow-sl items-center w-full max-w-box_max_mobi md:max-w-box_max h-40 md:h-72">
            <HeartPulse className="w-14 h-14 text-purple mb-3" />
            <h2 className="text-center font-inter font-bold text-h2_container_mobi tracking-ls md:text-h2_box">
             Health Focused
            </h2>
            <span className="font-inter font-normal px-6 sm:px-8 text-span_mobi md:text-span text-center">
              Organic, non-GMO, and pesticide-free options to keep your family healthy
            </span>
          </div>
          <div className="cursor-pointer flex flex-col justify-center rounded-box shadow-sl items-center w-full max-w-box_max_mobi md:max-w-box_max h-40 md:h-72">
            <Truck className="w-14 h-14 text-purple mb-3" />
            <h2 className="text-center font-inter font-bold text-h2_container_mobi tracking-ls md:text-h2_box">
              Free Delivery
            </h2>
            <span className="font-inter font-normal px-6 sm:px-8 text-span_mobi md:text-span text-center">
              Enjoy free delivery on orders over $50. No hidden fees, no surprises.
            </span>
          </div>
          <div className="cursor-pointer flex flex-col justify-center rounded-box shadow-sl items-center w-full max-w-box_max_mobi md:max-w-box_max h-40 md:h-72">
            <Award className="w-14 h-14 text-purple mb-3" />
            <h2 className="text-center font-inter font-bold text-h2_container_mobi tracking-ls md:text-h2_box">
              Award Winning
            </h2>
            <span className="font-inter font-normal px-6 sm:px-8 text-span_mobi md:text-span text-center">
              Recognized as the #1 grocery delivery service in customer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Choose;
