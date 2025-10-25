import { StockIssue, CreateIssueDto } from "../interface/issue";
import { BaseApiService } from "./baseApi.service";

class IssueService extends BaseApiService {
  async getAllIssues(): Promise<StockIssue[]> {
    const res = await this.axiosInstance.get("/inventory/issues");
    return res.data?.data ?? res.data;
  }
  async getIssueById(id: string): Promise<StockIssue> {
    const res = await this.axiosInstance.get(`/inventory/issues/${id}`);
    return res.data?.data ?? res.data;
  }
  async createIssue(dto: CreateIssueDto): Promise<StockIssue> {
    const res = await this.axiosInstance.post("/inventory/issues", dto);
    return res.data?.data ?? res.data;
  }
  calculateTotalQuantity(issue: StockIssue): number {
    return issue.details.reduce((sum, detail) => sum + detail.quantity, 0);
  }
  formatIssueDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  getIssueSummary(issue: StockIssue) {
    const totalQuantity = this.calculateTotalQuantity(issue);
    const totalProducts = issue.details.length;

    return {
      totalQuantity,
      totalProducts,
      warehouseName: issue.warehouse.name,
      issueDate: this.formatIssueDate(issue.issueDate),
    };
  }
}

export const issueService = new IssueService();
