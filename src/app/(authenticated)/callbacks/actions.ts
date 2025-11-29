"use server";

import { db } from "@/db";
import { callbacks, type NewCallback } from "@/db/schema";
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

  if (conditions.length > 0) {
    return db
      .select()
      .from(callbacks)
      .where(and(...conditions))
      .orderBy(callbacks.callbackDate);
  }

  return db.select().from(callbacks).orderBy(callbacks.callbackDate);
}

export async function getCallback(id: number) {
  const result = await db.select().from(callbacks).where(eq(callbacks.id, id));
  return result[0] || null;
}

export async function createCallback(formData: FormData) {
  const callbackDateStr = formData.get("callbackDate") as string;
  
  const data: NewCallback = {
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

  await db.update(callbacks).set({
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
