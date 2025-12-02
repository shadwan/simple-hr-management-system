"use server";

import { db } from "@/db";
import { callbacks, applicants, contacts, type NewCallback } from "@/db/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotesForEntity } from "../notes/actions";

export async function getCallbacks(search?: string, status?: string) {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(callbacks.name, `%${search}%`),
        ilike(callbacks.company, `%${search}%`),
        ilike(callbacks.phone, `%${search}%`),
        ilike(callbacks.reason, `%${search}%`)
      )
    );
  }

  if (status && status !== "all") {
    conditions.push(eq(callbacks.status, status));
  }

  // Join with applicants and contacts to get their names
  const baseQuery = db
    .select({
      id: callbacks.id,
      name: callbacks.name,
      company: callbacks.company,
      phone: callbacks.phone,
      email: callbacks.email,
      reason: callbacks.reason,
      notes: callbacks.notes,
      callbackDate: callbacks.callbackDate,
      status: callbacks.status,
      applicantId: callbacks.applicantId,
      contactId: callbacks.contactId,
      createdAt: callbacks.createdAt,
      updatedAt: callbacks.updatedAt,
      applicantFirstName: applicants.firstName,
      applicantLastName: applicants.lastName,
      applicantPhone: applicants.phone,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
      contactPhone: contacts.phone,
    })
    .from(callbacks)
    .leftJoin(applicants, eq(callbacks.applicantId, applicants.id))
    .leftJoin(contacts, eq(callbacks.contactId, contacts.id));

  if (conditions.length > 0) {
    return baseQuery
      .where(and(...conditions))
      .orderBy(callbacks.callbackDate);
  }

  return baseQuery.orderBy(callbacks.callbackDate);
}

export async function getCallback(id: number) {
  const result = await db
    .select({
      id: callbacks.id,
      name: callbacks.name,
      company: callbacks.company,
      phone: callbacks.phone,
      email: callbacks.email,
      reason: callbacks.reason,
      notes: callbacks.notes,
      callbackDate: callbacks.callbackDate,
      status: callbacks.status,
      applicantId: callbacks.applicantId,
      contactId: callbacks.contactId,
      createdAt: callbacks.createdAt,
      updatedAt: callbacks.updatedAt,
      applicantFirstName: applicants.firstName,
      applicantLastName: applicants.lastName,
      applicantPhone: applicants.phone,
      applicantEmail: applicants.email,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
      contactPhone: contacts.phone,
      contactEmail: contacts.email,
    })
    .from(callbacks)
    .leftJoin(applicants, eq(callbacks.applicantId, applicants.id))
    .leftJoin(contacts, eq(callbacks.contactId, contacts.id))
    .where(eq(callbacks.id, id));
  return result[0] || null;
}

export async function getApplicantsForSelect() {
  return db
    .select({
      id: applicants.id,
      firstName: applicants.firstName,
      lastName: applicants.lastName,
      phone: applicants.phone,
      email: applicants.email,
    })
    .from(applicants)
    .where(eq(applicants.status, "active"))
    .orderBy(applicants.lastName);
}

export async function getContactsForSelect() {
  return db
    .select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      phone: contacts.phone,
      email: contacts.email,
    })
    .from(contacts)
    .where(eq(contacts.status, "active"))
    .orderBy(contacts.lastName);
}

export async function createCallback(formData: FormData) {
  const callbackDateStr = formData.get("callbackDate") as string;
  const applicantIdStr = formData.get("applicantId") as string;
  const contactIdStr = formData.get("contactId") as string;
  
  const applicantId = applicantIdStr ? parseInt(applicantIdStr) : null;
  const contactId = contactIdStr ? parseInt(contactIdStr) : null;

  const data: NewCallback = {
    applicantId,
    contactId,
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    reason: formData.get("reason") as string,
    notes: formData.get("notes") as string,
    callbackDate: callbackDateStr ? new Date(callbackDateStr) : null,
    status: formData.get("status") as string || "pending",
  };

  const result = await db.insert(callbacks).values(data).returning({ id: callbacks.id });
  const newCallbackId = result[0].id;

  // Handle notes from form
  const noteContents = formData.getAll("notes") as string[];
  if (noteContents.length > 0) {
    await createNotesForEntity("callback", newCallbackId, noteContents);
  }

  revalidatePath("/callbacks");
  redirect("/callbacks");
}

export async function updateCallback(id: number, formData: FormData) {
  const existing = await getCallback(id);
  if (!existing) throw new Error("Callback not found");

  const callbackDateStr = formData.get("callbackDate") as string;
  const applicantIdStr = formData.get("applicantId") as string;
  const contactIdStr = formData.get("contactId") as string;

  const applicantId = applicantIdStr ? parseInt(applicantIdStr) : null;
  const contactId = contactIdStr ? parseInt(contactIdStr) : null;

  await db.update(callbacks).set({
    applicantId,
    contactId,
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    reason: formData.get("reason") as string,
    notes: formData.get("notes") as string,
    callbackDate: callbackDateStr ? new Date(callbackDateStr) : null,
    status: formData.get("status") as string || "pending",
    updatedAt: new Date(),
  }).where(eq(callbacks.id, id));

  revalidatePath("/callbacks");
  redirect("/callbacks");
}

export async function deleteCallback(id: number) {
  await db.delete(callbacks).where(eq(callbacks.id, id));
  revalidatePath("/callbacks");
}
