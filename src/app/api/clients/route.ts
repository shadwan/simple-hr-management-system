import { db } from "@/db";
import { clients } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allClients = await db.select().from(clients).orderBy(clients.companyName);
  return NextResponse.json(allClients);
}
