"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type EntityType = "applicant" | "client" | "contact" | "mission" | "callback";

export async function getNotes(entityType: EntityType, entityId: number) {
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.entityType, entityType), eq(notes.entityId, entityId)))
    .orderBy(desc(notes.createdAt));
}

export async function addNote(entityType: EntityType, entityId: number, content: string) {
  if (!content.trim()) return;
  
  await db.insert(notes).values({
    entityType,
    entityId,
    content: content.trim(),
  });

  // Revalidate the entity's page
  const paths: Record<EntityType, string> = {
    applicant: `/applicants/${entityId}`,
    client: `/clients/${entityId}`,
    contact: `/contacts/${entityId}`,
    mission: `/missions/${entityId}`,
    callback: `/callbacks/${entityId}`,
  };
  
  revalidatePath(paths[entityType]);
}

export async function deleteNote(noteId: number, entityType: EntityType, entityId: number) {
  await db.delete(notes).where(eq(notes.id, noteId));

  const paths: Record<EntityType, string> = {
    applicant: `/applicants/${entityId}`,
    client: `/clients/${entityId}`,
    contact: `/contacts/${entityId}`,
    mission: `/missions/${entityId}`,
    callback: `/callbacks/${entityId}`,
  };
  
  revalidatePath(paths[entityType]);
}

// For creating multiple notes during entity creation
export async function createNotesForEntity(entityType: EntityType, entityId: number, noteContents: string[]) {
  const validNotes = noteContents.filter(content => content.trim());
  
  if (validNotes.length === 0) return;
  
  await db.insert(notes).values(
    validNotes.map(content => ({
      entityType,
      entityId,
      content: content.trim(),
    }))
  );
}
