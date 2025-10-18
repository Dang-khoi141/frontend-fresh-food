export interface Promotion {
  id: string;
  code: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreatePromotionDto {
  code: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface UpdatePromotionDto {
  code?: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface ApplyPromotionDto {
  code: string;
  total: number;
}

export interface ApplyPromotionResponse {
  discount: number;
  finalTotal: number;
  promotion: Promotion;
}

export const isPromotionActive = (promotion: Promotion): boolean => {
  if (!promotion.isActive) return false;

  const now = new Date();
  if (promotion.startDate && new Date(promotion.startDate) > now) return false;
  if (promotion.endDate && new Date(promotion.endDate) < now) return false;

  return true;
};

export const getPromotionDiscount = (
  promotion: Promotion,
  orderTotal: number
): number => {
  if (promotion.discountPercent) {
    return (orderTotal * promotion.discountPercent) / 100;
  }
  return promotion.discountAmount || 0;
};

export const formatPromotionDates = (promotion: Promotion): string => {
  if (!promotion.startDate && !promotion.endDate) return "No time limit";

  const start = promotion.startDate
    ? new Date(promotion.startDate).toLocaleDateString("vi-VN")
    : "∞";
  const end = promotion.endDate
    ? new Date(promotion.endDate).toLocaleDateString("vi-VN")
    : "∞";

  return `${start} - ${end}`;
};
