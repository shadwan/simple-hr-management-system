"use server";

import { db } from "@/db";
import { missions, clients, missionApplicants, applicants, type NewMission } from "@/db/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotesForEntity } from "../notes/actions";

export async function getMissions(search?: string, status?: string) {
  let query = db
    .select({
      id: missions.id,
      title: missions.title,
      clientId: missions.clientId,
      clientName: clients.companyName,
      description: missions.description,
      requiredSkills: missions.requiredSkills,
      location: missions.location,
      startDate: missions.startDate,
      endDate: missions.endDate,
      notes: missions.notes,
      status: missions.status,
      createdAt: missions.createdAt,
      updatedAt: missions.updatedAt,
    })
    .from(missions)
    .leftJoin(clients, eq(missions.clientId, clients.id));

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(missions.title, `%${search}%`),
        ilike(missions.location, `%${search}%`),
        ilike(missions.description, `%${search}%`),
        ilike(clients.companyName, `%${search}%`)
      )
    );
  }

  if (status && status !== "all") {
    conditions.push(eq(missions.status, status));
  }

  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(missions.createdAt);
  }

  return query.orderBy(missions.createdAt);
}

export async function getMission(id: number) {
  const result = await db
    .select({
      id: missions.id,
      title: missions.title,
      clientId: missions.clientId,
      clientName: clients.companyName,
      description: missions.description,
      requiredSkills: missions.requiredSkills,
      location: missions.location,
      startDate: missions.startDate,
      endDate: missions.endDate,
      notes: missions.notes,
      status: missions.status,
      createdAt: missions.createdAt,
      updatedAt: missions.updatedAt,
    })
    .from(missions)
    .leftJoin(clients, eq(missions.clientId, clients.id))
    .where(eq(missions.id, id));
  return result[0] || null;
}

export async function getClients() {
  return db.select().from(clients).orderBy(clients.companyName);
}

export async function createMission(formData: FormData) {
  const clientIdStr = formData.get("clientId") as string;

  const data: NewMission = {
    title: formData.get("title") as string,
    clientId: clientIdStr ? parseInt(clientIdStr) : null,
    description: formData.get("description") as string,
    requiredSkills: formData.get("requiredSkills") as string,
    location: formData.get("location") as string,
    startDate: formData.get("startDate") as string || null,
    endDate: formData.get("endDate") as string || null,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string || "open",
  };

  const result = await db.insert(missions).values(data).returning({ id: missions.id });
  const newMissionId = result[0].id;

  // Handle notes from form
  const noteContents = formData.getAll("notes") as string[];
  if (noteContents.length > 0) {
    await createNotesForEntity("mission", newMissionId, noteContents);
  }

  revalidatePath("/missions");
  redirect("/missions");
}

export async function updateMission(id: number, formData: FormData) {
  const existing = await getMission(id);
  if (!existing) throw new Error("Mission not found");

  const clientIdStr = formData.get("clientId") as string;

  await db.update(missions).set({
    title: formData.get("title") as string,
    clientId: clientIdStr ? parseInt(clientIdStr) : null,
    description: formData.get("description") as string,
    requiredSkills: formData.get("requiredSkills") as string,
    location: formData.get("location") as string,
    startDate: formData.get("startDate") as string || null,
    endDate: formData.get("endDate") as string || null,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string || "open",
    updatedAt: new Date(),
  }).where(eq(missions.id, id));

  revalidatePath("/missions");
  redirect("/missions");
}

export async function deleteMission(id: number) {
  await db.delete(missions).where(eq(missions.id, id));
  revalidatePath("/missions");
}

// Mission Applicants management
export async function getMissionApplicants(missionId: number) {
  return db
    .select({
      id: missionApplicants.id,
      missionId: missionApplicants.missionId,
      applicantId: missionApplicants.applicantId,
      notes: missionApplicants.notes,
      createdAt: missionApplicants.createdAt,
      applicantFirstName: applicants.firstName,
      applicantLastName: applicants.lastName,
      applicantEmail: applicants.email,
      applicantCurrentJobTitle: applicants.currentJobTitle,
    })
    .from(missionApplicants)
    .innerJoin(applicants, eq(missionApplicants.applicantId, applicants.id))
    .where(eq(missionApplicants.missionId, missionId))
    .orderBy(missionApplicants.createdAt);
}

export async function getAvailableApplicants(missionId: number) {
  // Get all applicants that are NOT already assigned to this mission
  const assignedApplicants = await db
    .select({ applicantId: missionApplicants.applicantId })
    .from(missionApplicants)
    .where(eq(missionApplicants.missionId, missionId));

  const assignedIds = assignedApplicants.map(a => a.applicantId);

  const allApplicants = await db
    .select()
    .from(applicants)
    .where(eq(applicants.status, "active"))
    .orderBy(applicants.lastName);

  return allApplicants.filter(a => !assignedIds.includes(a.id));
}

export async function addApplicantToMission(missionId: number, applicantId: number) {
  // Check if already assigned
  const existing = await db
    .select()
    .from(missionApplicants)
    .where(
      and(
        eq(missionApplicants.missionId, missionId),
        eq(missionApplicants.applicantId, applicantId)
      )
    );

  if (existing.length > 0) {
    throw new Error("Applicant already assigned to this mission");
  }

  await db.insert(missionApplicants).values({
    missionId,
    applicantId,
  });

  revalidatePath(`/missions/${missionId}`);
}

export async function removeApplicantFromMission(missionId: number, applicantId: number) {
  await db
    .delete(missionApplicants)
    .where(
      and(
        eq(missionApplicants.missionId, missionId),
        eq(missionApplicants.applicantId, applicantId)
      )
    );

  revalidatePath(`/missions/${missionId}`);
}
