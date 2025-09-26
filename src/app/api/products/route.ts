import { NextResponse } from "next/server";
import { productService } from "@/lib/service/product.service";

export async function GET() {
  try {
    const products = await productService.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
