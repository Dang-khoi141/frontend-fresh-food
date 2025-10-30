export interface IReview {
  id?: string;
  rating: number;
  comment: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  product?: {
    id: string;
    name: string;
    image?: string;
  };
  productId?: string;
  isVerifiedPurchase?: boolean;
  createdAt?: string;
}

export interface ReviewModalProps {
  productId: string;
  productName: string;
  productImage?: string;
  existingReview?: IReview | null;
  onClose: () => void;
  onSuccess?: (reviewData: IReview) => void;
}