export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getApplicantsForSelect } from "@/app/(authenticated)/callbacks/actions";

export async function GET() {
  const applicants = await getApplicantsForSelect();
  return NextResponse.json(applicants);
}
