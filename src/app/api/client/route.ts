import { NextResponse } from "next/server";
import { ClientService } from "../../../lib/service/client.service";

export async function GET() {
  try {
    const clients = await ClientService.getInstance().getAllClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
