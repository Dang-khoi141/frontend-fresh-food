import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface StockIssueDetail {
  id: string;
  quantity: number;
  product: Product;
}

export interface StockIssue {
  id: string;
  warehouse: Warehouse;
  orderId?: string;
  issueDate: string;
  issuedBy: string;
  details: StockIssueDetail[];
}

export interface CreateIssueItemDto {
  productId: string;
  quantity: number;
}

export interface CreateIssueDto {
  warehouseId: string;
  orderId: string;
  items: CreateIssueItemDto[];
}

export interface IssueListResponse {
  data: StockIssue[];
  total: number;
}

export interface UseFetchIssueOptions {
  issueId?: string;
  autoFetch?: boolean;
  onSuccess?: (data: StockIssue | StockIssue[]) => void;
  onError?: (error: any) => void;
}

export interface UseFetchIssueResult {
  issue: StockIssue | null;
  issues: StockIssue[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchAllIssues: () => Promise<void>;
}

export interface UseCreateIssueOptions {
  onSuccess?: (data: StockIssue) => void;
  onError?: (error: any) => void;
}

export interface UseCreateIssueResult {
  createIssue: (dto: CreateIssueDto) => Promise<StockIssue>;
  loading: boolean;
  error: Error | null;
}
