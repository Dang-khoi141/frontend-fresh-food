"use client";

import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import { Suspense } from "react";

import Choose from "../lib/components/landing-page/container/choose";
import Experience from "../lib/components/landing-page/experience/experience";
import FreshNav from "../lib/components/landing-page/header/header-nav";
import Header from "../lib/components/landing-page/header/header";

const LandingPage = () => (
  <div>
    <main className="overflow-hidden">
      <FreshNav/>
      <Header/>
      <Choose/>
      <Experience/>
      {/* <ClientSay/> */}
    </main>
  </div>
);

export default function IndexPage() {
  return (
    <Suspense>
      <Authenticated
        key="home-page"
        fallback={<LandingPage />}
      >
        <NavigateToResource />
      </Authenticated>
    </Suspense>
  );
}
