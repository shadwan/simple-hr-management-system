export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getContactsForSelect } from "@/app/(authenticated)/callbacks/actions";

export async function GET() {
  const contacts = await getContactsForSelect();
  return NextResponse.json(contacts);
}
