// "use client";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect } from "react";
// import Slider, { CustomArrowProps } from "react-slick";
// import "slick-carousel/slick/slick-theme.css";
// import "slick-carousel/slick/slick.css";
// import useFetchClient from "../../../hooks/usehookClient";

// const SampleNextArrow = (props: CustomArrowProps) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         width: "70px",
//         height: "150px",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         cursor: "pointer",
//         opacity: 0.5,
//         zIndex: 20,
//       }}
//       onClick={onClick}
//     >
//       <ChevronRight className="h-12 w-12  text-black" />
//     </div>
//   );
// };

// const SamplePrevArrow = (props: CustomArrowProps) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         width: "70px",
//         height: "150px",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         cursor: "pointer",
//         opacity: 0.5,
//         zIndex: 20,
//       }}
//       onClick={onClick}
//     >
//       <ChevronLeft className="h-12 w-12  text-black" />
//     </div>
//   );
// };

// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 3,
//   className: "center",
//   centerMode: true,
//   centerPadding: "90px",
//   slidesToScroll: 1,
//   prevArrow: <SamplePrevArrow />,
//   nextArrow: <SampleNextArrow />,
//   customPaging: () => (
//     <div
//       style={{
//         marginTop: "20px",
//         width: "12px",
//         height: "12px",
//         borderRadius: "50%",
//         background: "#cfcfcf",
//       }}
//     ></div>
//   ),
//   appendDots: (dots: any) => (
//     <div style={{ marginTop: "20px" }}>
//       <ul
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "12px",
//           padding: 0,
//           margin: 0,
//           listStyle: "none",
//         }}
//       >
//         {dots}
//       </ul>
//       <style>
//         {`
//           .slick-dots li.slick-active div {
//             background-color: #6b6cff !important;
//           }
//         `}
//       </style>
//     </div>
//   ),
//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 1,
//         centerMode: true,
//         centerPadding: "30px",
//       },
//     },
//     {
//       breakpoint: 768,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         centerMode: true,
//         centerPadding: "90px",
//       },
//     },
//     {
//       breakpoint: 640,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         centerMode: true,
//         centerPadding: "5px",
//       },
//     },
//   ],
// };

// const ClientSay = () => {
//   const { client, fetchClients } = useFetchClient();
//   useEffect(() => {
//     fetchClients();
//   }, []);
//   return (
//     <div className="flex justify-center items-center text-center w-full max-h bg-client">
//       <div className="grid grid-cols-1 gap-7 sm:gap-0 justify-center items-center sm:grid-rows-2 sm:w-full py-16 sm:py-20">
//         <div className="flex flex-col gap-4 justify-center items-center text-center">
//           <h1 className="font-bold text-h1_title_mobi sm:text-h1_title">
//             What Our Clients Say
//           </h1>
//           <h2 className="flex justify-center items-center font-normal px-4 text-h2_container_mobi sm:text-h2_container text-center">
//             {`Don't just take our word for it. Here's what our clients have to say.`}
//           </h2>
//         </div>
//         <div className="flex justify-center items-center">
//           <Slider
//             {...settings}
//             className="w-box_client sm:max-w-max_scroll sm:w-full"
//           >
//             {(client ?? []).map((plan) => {
//               return (
//                 <div key={plan.id} className="cover-box group flex items-start sm:bg-bg_sm rounded-2xl shadow-md px-5 py-5 sm:px-6 sm:py-6 h-box_client w-box_client cursor-pointer">
//                   <div className="flex text-left self-start">

//                     <div className="flex flex-col justify-center items-start ml-3">
//                       <span className="font-inter text-h2_container_mobi sm:text-h2_container font-bold">
//                         {plan.name}
//                       </span>
//                       <span className="title font-inter font-medium text-span_mobi_2025_client sm:text-span_client text-gay_client">
//                         {plan.title}
//                       </span>
//                     </div>
//                   </div>
//                   <span className="font-inter font-normal text-span sm:text-btn w-span_clien mt-3 text-left self-start block">
//                     "{plan.content}"
//                   </span>
//                 </div>
//               );
//             })}
//           </Slider>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default ClientSay;
