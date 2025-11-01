"use client";

import { NavigateToResource } from "@refinedev/nextjs-router";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import { UserRole } from "../lib/enums/user-role.enum";

import CategoriesProduct from "../lib/components/landing-page/categories-product/categories-product";
import CategoryGrid from "../lib/components/landing-page/categories/category-grid";
import FeaturedProducts from "../lib/components/landing-page/featured/featured-products";
import FlashSale from "../lib/components/landing-page/flash-sale/flash-sale";
import Footer from "../lib/components/landing-page/footer/footer";
import FreshNav from "../lib/components/landing-page/header/header-nav";
import HeroSlider from "../lib/components/landing-page/hero/hero-slider";

const LandingPage = () => (
  <div className="min-h-screen bg-gray-50">
    <main className="overflow-hidden">
      <FreshNav />

      <HeroSlider />

      <CategoryGrid />

      {/* <FlashSale /> */}

      {/* <FeaturedProducts /> */}

      <Footer />
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
