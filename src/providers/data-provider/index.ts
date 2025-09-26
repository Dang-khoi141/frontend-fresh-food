"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    secret: process.env.NEXT_PUBLIC_SECRET_KEY,
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(async config => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});
export const dataProvider = dataProviderSimpleRest(API_URL, axiosInstance);
