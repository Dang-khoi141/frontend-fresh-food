export interface AIResponse {
  reply: string;
  products?: any[];
  promotions?: any[];
}
export interface Message {
  role: "user" | "ai";
  text: string;
  products?: any[];
}
