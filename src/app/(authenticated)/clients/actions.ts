"use server";

import { db } from "@/db";
import { clients, missions, type NewClient } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotesForEntity } from "../notes/actions";

export async function getClients(search?: string) {
  if (search) {
    return db
      .select()
      .from(clients)
      .where(
        or(
          ilike(clients.companyName, `%${search}%`),
          ilike(clients.contactName, `%${search}%`),
          ilike(clients.contactEmail, `%${search}%`),
          ilike(clients.city, `%${search}%`)
        )
      )
      .orderBy(clients.createdAt);
  }
  return db.select().from(clients).orderBy(clients.createdAt);
}

export async function getClient(id: number) {
  const result = await db.select().from(clients).where(eq(clients.id, id));
  return result[0] || null;
}

export async function getClientWithMissions(id: number) {
  const client = await getClient(id);
  if (!client) return null;

  const clientMissions = await db
    .select()
    .from(missions)
    .where(eq(missions.clientId, id))
    .orderBy(missions.createdAt);

  return { client, missions: clientMissions };
}

export async function createClient(formData: FormData) {
  const data: NewClient = {
    companyName: formData.get("companyName") as string,
    vatNumber: formData.get("vatNumber") as string,
    address: formData.get("address") as string,
    postalCode: formData.get("postalCode") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
    contactName: formData.get("contactName") as string,
    contactEmail: formData.get("contactEmail") as string,
    contactPhone: formData.get("contactPhone") as string,
    additionalContact: formData.get("additionalContact") as string,
    notes: formData.get("notes") as string,
    status: (formData.get("status") as string) || "active",
  };

  const result = await db.insert(clients).values(data).returning({ id: clients.id });
  const newClientId = result[0].id;

  // Handle notes from form
  const noteContents = formData.getAll("notes") as string[];
  if (noteContents.length > 0) {
    await createNotesForEntity("client", newClientId, noteContents);
  }

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(id: number, formData: FormData) {
  const existing = await getClient(id);
  if (!existing) throw new Error("Client not found");

  await db
    .update(clients)
    .set({
      companyName: formData.get("companyName") as string,
      vatNumber: formData.get("vatNumber") as string,
      address: formData.get("address") as string,
      postalCode: formData.get("postalCode") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      contactName: formData.get("contactName") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      additionalContact: formData.get("additionalContact") as string,
      notes: formData.get("notes") as string,
      status: (formData.get("status") as string) || "active",
      updatedAt: new Date(),
    })
    .where(eq(clients.id, id));

  revalidatePath("/clients");
  redirect("/clients");
}

export async function deleteClient(id: number) {
  await db.delete(clients).where(eq(clients.id, id));
  revalidatePath("/clients");
}
