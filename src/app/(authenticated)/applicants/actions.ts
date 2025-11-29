"use server";

import { db } from "@/db";
import { applicants, type NewApplicant } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { createNotesForEntity } from "../notes/actions";

export async function getApplicants(search?: string) {
  if (search) {
    return db
      .select()
      .from(applicants)
      .where(
        or(
          ilike(applicants.firstName, `%${search}%`),
          ilike(applicants.lastName, `%${search}%`),
          ilike(applicants.email, `%${search}%`),
          ilike(applicants.city, `%${search}%`),
          ilike(applicants.currentJobTitle, `%${search}%`)
        )
      )
      .orderBy(applicants.createdAt);
  }
  return db.select().from(applicants).orderBy(applicants.createdAt);
}

export async function getApplicant(id: number) {
  const result = await db.select().from(applicants).where(eq(applicants.id, id));
  return result[0] || null;
}

export async function createApplicant(formData: FormData) {
  const cvFile = formData.get("cv") as File | null;
  const extraFile = formData.get("extraFile") as File | null;
  
  let cvFilename: string | null = null;
  let extraFilename: string | null = null;
  
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (cvFile && cvFile.size > 0) {
    const bytes = await cvFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    cvFilename = `${firstName}-${lastName}-CV.pdf`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", cvFilename);
    await writeFile(uploadPath, buffer);
  }

  if (extraFile && extraFile.size > 0) {
    const bytes = await extraFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    extraFilename = `${firstName}-${lastName}-extra-${extraFile.name}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", extraFilename);
    await writeFile(uploadPath, buffer);
  }

  const data: NewApplicant = {
    firstName,
    lastName,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    address: formData.get("address") as string,
    postalCode: formData.get("postalCode") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
    currentJobTitle: formData.get("currentJobTitle") as string,
    currentEmployer: formData.get("currentEmployer") as string,
    desiredPosition: formData.get("desiredPosition") as string,
    availability: formData.get("availability") as string,
    noticePeriod: formData.get("noticePeriod") as string,
    salaryExpectation: formData.get("salaryExpectation") as string,
    cvFilename,
    extraFilename,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string || "active",
  };

  const result = await db.insert(applicants).values(data).returning({ id: applicants.id });
  const newApplicantId = result[0].id;

  // Handle notes from form
  const noteContents = formData.getAll("notes") as string[];
  if (noteContents.length > 0) {
    await createNotesForEntity("applicant", newApplicantId, noteContents);
  }

  revalidatePath("/applicants");
  redirect("/applicants");
}

export async function updateApplicant(id: number, formData: FormData) {
  const existing = await getApplicant(id);
  if (!existing) throw new Error("Applicant not found");

  const cvFile = formData.get("cv") as File | null;
  const extraFile = formData.get("extraFile") as File | null;
  
  let cvFilename = existing.cvFilename;
  let extraFilename = existing.extraFilename;
  
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (cvFile && cvFile.size > 0) {
    // Delete old file if exists
    if (existing.cvFilename) {
      try {
        await unlink(path.join(process.cwd(), "public", "uploads", existing.cvFilename));
      } catch {}
    }
    const bytes = await cvFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    cvFilename = `${firstName}-${lastName}-CV.pdf`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", cvFilename);
    await writeFile(uploadPath, buffer);
  }

  if (extraFile && extraFile.size > 0) {
    if (existing.extraFilename) {
      try {
        await unlink(path.join(process.cwd(), "public", "uploads", existing.extraFilename));
      } catch {}
    }
    const bytes = await extraFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    extraFilename = `${firstName}-${lastName}-extra-${extraFile.name}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", extraFilename);
    await writeFile(uploadPath, buffer);
  }

  await db.update(applicants).set({
    firstName,
    lastName,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    address: formData.get("address") as string,
    postalCode: formData.get("postalCode") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
    currentJobTitle: formData.get("currentJobTitle") as string,
    currentEmployer: formData.get("currentEmployer") as string,
    desiredPosition: formData.get("desiredPosition") as string,
    availability: formData.get("availability") as string,
    noticePeriod: formData.get("noticePeriod") as string,
    salaryExpectation: formData.get("salaryExpectation") as string,
    cvFilename,
    extraFilename,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string || "active",
    updatedAt: new Date(),
  }).where(eq(applicants.id, id));

  revalidatePath("/applicants");
  redirect("/applicants");
}

export async function deleteApplicant(id: number) {
  const existing = await getApplicant(id);
  if (existing) {
    if (existing.cvFilename) {
      try {
        await unlink(path.join(process.cwd(), "public", "uploads", existing.cvFilename));
      } catch {}
    }
    if (existing.extraFilename) {
      try {
        await unlink(path.join(process.cwd(), "public", "uploads", existing.extraFilename));
      } catch {}
    }
  }
  await db.delete(applicants).where(eq(applicants.id, id));
  revalidatePath("/applicants");
}
