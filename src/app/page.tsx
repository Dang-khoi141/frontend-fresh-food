"use client";

import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { UserRole } from "../lib/enums/user-role.enum";

import FreshNav from "../lib/components/landing-page/header/header-nav";
import Footer from "../lib/components/landing-page/footer/footer";
import HeroSlider from "../lib/components/landing-page/hero/hero-slider";
import CategoryGrid from "../lib/components/landing-page/categories/category-grid";
import PromotionBanners from "../lib/components/landing-page/promotions/promotion-banners";
import FlashSale from "../lib/components/landing-page/flash-sale/flash-sale";
import FeaturedProducts from "../lib/components/landing-page/featured/featured-products";
import CategoriesProduct from "../lib/components/landing-page/categories-product/categories-product";

const LandingPage = () => (
  <div className="min-h-screen bg-gray-50">
    <main className="overflow-hidden">
      <FreshNav />
      <CategoriesProduct />
      {/* <Choose />
      <TrendingProducts />
      <Experience />
      <TopCategories />
      <Footer /> */}
    </main>
  </div>
);

export default function IndexPage() {
  const { data: session } = useSession();
  const role = (session as any)?.user?.role;

  return (
    <Suspense>
      {role === UserRole.CUSTOMER || !role ? (
        <LandingPage />
      ) : (
        <NavigateToResource />
      )}
    </Suspense>
  );
}
