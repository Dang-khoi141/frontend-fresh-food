import { NextRequest, NextResponse } from "next/server";
import { issueService } from "../../../lib/service/issue.service";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const issue = await issueService.getIssueById(id);
      return NextResponse.json(issue);
    }
    const issues = await issueService.getAllIssues();
    return NextResponse.json(issues);
  } catch (error: any) {
    console.error("Failed to fetch issues:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch issues" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const issue = await issueService.createIssue(body);
    return NextResponse.json(issue, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create issue:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create issue" },
      { status: error.response?.status || 500 }
    );
  }
}
