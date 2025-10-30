import { axiosInstance } from "../../providers/data-provider";
import { AIResponse } from "../interface/ai";

export const AIService = {
  async sendMessage(message: string): Promise<AIResponse> {
    const res = await axiosInstance.post("/ai/query", { message });
    return res.data.data;
  },
};
