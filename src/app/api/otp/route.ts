import { NextResponse } from "next/server";
import { otpService } from "../../../lib/service/otp.service";

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    const data = await otpService.sendOtp(email);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
