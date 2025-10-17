import { NextResponse } from "next/server";
import { categoryService } from "../../../lib/service/category.service";

export async function GET() {
  try {
    const category = await categoryService.getAllCategories();
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
