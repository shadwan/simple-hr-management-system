"use server";

import { db } from "@/db";
import { contacts, clients, type NewContact } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotesForEntity } from "../notes/actions";

export async function getContacts(search?: string) {
  if (search) {
    return db
      .select({
        id: contacts.id,
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        email: contacts.email,
        phone: contacts.phone,
        role: contacts.role,
        linkedinUrl: contacts.linkedinUrl,
        city: contacts.city,
        country: contacts.country,
        notes: contacts.notes,
        status: contacts.status,
        clientId: contacts.clientId,
        createdAt: contacts.createdAt,
        updatedAt: contacts.updatedAt,
        clientName: clients.companyName,
      })
      .from(contacts)
      .leftJoin(clients, eq(contacts.clientId, clients.id))
      .where(
        or(
          ilike(contacts.firstName, `%${search}%`),
          ilike(contacts.lastName, `%${search}%`),
          ilike(contacts.email, `%${search}%`),
          ilike(contacts.city, `%${search}%`),
          ilike(contacts.role, `%${search}%`),
          ilike(clients.companyName, `%${search}%`)
        )
      )
      .orderBy(contacts.createdAt);
  }
  return db
    .select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      email: contacts.email,
      phone: contacts.phone,
      role: contacts.role,
      linkedinUrl: contacts.linkedinUrl,
      city: contacts.city,
      country: contacts.country,
      notes: contacts.notes,
      status: contacts.status,
      clientId: contacts.clientId,
      createdAt: contacts.createdAt,
      updatedAt: contacts.updatedAt,
      clientName: clients.companyName,
    })
    .from(contacts)
    .leftJoin(clients, eq(contacts.clientId, clients.id))
    .orderBy(contacts.createdAt);
}

export async function getContact(id: number) {
  const result = await db.select().from(contacts).where(eq(contacts.id, id));
  return result[0] || null;
}

export async function getClients() {
  return db.select().from(clients).orderBy(clients.companyName);
}

export async function createContact(formData: FormData) {
  const clientIdStr = formData.get("clientId") as string;
  
  const data: NewContact = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    role: formData.get("role") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string || "active",
    clientId: clientIdStr ? parseInt(clientIdStr) : null,
  };

  const result = await db.insert(contacts).values(data).returning({ id: contacts.id });
  const newContactId = result[0].id;

  // Handle notes from form
  const noteContents = formData.getAll("notes") as string[];
  if (noteContents.length > 0) {
    await createNotesForEntity("contact", newContactId, noteContents);
  }

  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function updateContact(id: number, formData: FormData) {
  const existing = await getContact(id);
  if (!existing) throw new Error("Contact not found");

  const clientIdStr = formData.get("clientId") as string;

  await db.update(contacts).set({
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    role: formData.get("role") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string || "active",
    clientId: clientIdStr ? parseInt(clientIdStr) : null,
    updatedAt: new Date(),
  }).where(eq(contacts.id, id));

  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function deleteContact(id: number) {
  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath("/contacts");
}
