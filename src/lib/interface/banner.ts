import { Promotion } from "./promotion";

export enum BannerPlacement {
  HERO_SLIDER = "hero_slider",
  SIDEBAR = "sidebar",
  POPUP = "popup",
  CATEGORY = "category",
}

export interface Banner {
  id: string;
  imageUrl: string;
  placement: string;
  sortOrder: number;
  linkUrl?: string;
  isActive: boolean;
  clickCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerDto {
  title: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  placement?: BannerPlacement;
  sortOrder?: number;
  linkUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  promotionId?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> {}

export interface BannerAnalytics {
  id: string;
  title: string;
  views: number;
  clicks: number;
  ctr: string;
}

export interface BannerResponse {
  statusCode: number;
  message: string;
  data: Banner;
}

export interface BannersResponse {
  statusCode: number;
  message: string;
  data: Banner[];
}

export interface BannerAnalyticsResponse {
  statusCode: number;
  message: string;
  data: BannerAnalytics;
}

export interface UseFetchBannersOptions {
  placement?: BannerPlacement;
  autoFetch?: boolean;
  activeOnly?: boolean;
}
