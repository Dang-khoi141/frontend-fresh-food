"use client";

import Choose from "../lib/components/landing-page/container/choose";
import Experience from "../lib/components/landing-page/experience/experience";
import TrendingProducts from "../lib/components/landing-page/trending-products/trending-products";
import TopCategories from "../lib/components/landing-page/top-categories/top-categories";
import CategoriesProduct from "../lib/components/landing-page/categories-product/categories-product";
import FreshNav from "../lib/components/landing-page/header/header-nav";
import Footer from "../lib/components/landing-page/footer/footer";

export default function LandingPage() {
  return (
    <div>
      <main className="overflow-hidden">
        <FreshNav />
        <CategoriesProduct />
        <Choose />
        <TrendingProducts />
        <Experience />
        <TopCategories />
        {/* <ClientSay/> */}
        <Footer />
      </main>
    </div>
  );
}
