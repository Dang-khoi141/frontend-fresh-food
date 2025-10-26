export interface IReview {
  id?: string;
  rating: number;
  comment: string;
  user?: {
    id: string;
    name: string;
  };
  productId: string;
  createdAt?: string;
}
