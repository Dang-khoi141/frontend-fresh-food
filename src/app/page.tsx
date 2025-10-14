"use client";

import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import { Suspense } from "react";

import Choose from "../lib/components/landing-page/container/choose";
import Experience from "../lib/components/landing-page/experience/experience";
import TrendingProducts from "../lib/components/landing-page/trending-products/trending-products";
import TopCategories from "../lib/components/landing-page/top-categories/top-categories";
import CategoriesProduct from "../lib/components/landing-page/categories-product/categories-product";
import FreshNav from "../lib/components/landing-page/header/header-nav";
import Footer from "../lib/components/landing-page/footer/footer";
import { useSession } from "next-auth/react";
import { UserRole } from "../lib/enums/user-role.enum";

const LandingPage = () => (
  <div>
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
