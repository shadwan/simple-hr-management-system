"use server";

import { db } from "@/db";
import { applicants, clients, contacts, missions, callbacks } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export type SearchResults = {
  applicants: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    city: string | null;
    currentJobTitle: string | null;
  }[];
  clients: {
    id: number;
    companyName: string;
    contactName: string | null;
    contactEmail: string | null;
    city: string | null;
  }[];
  contacts: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    city: string | null;
    role: string | null;
  }[];
  missions: {
    id: number;
    title: string;
    location: string | null;
    status: string;
  }[];
  callbacks: {
    id: number;
    name: string;
    company: string | null;
    phone: string | null;
    reason: string | null;
    status: string;
  }[];
};

export async function globalSearch(query: string): Promise<SearchResults> {
  if (!query || query.trim().length === 0) {
    return {
      applicants: [],
      clients: [],
      contacts: [],
      missions: [],
      callbacks: [],
    };
  }

  const searchTerm = `%${query.trim()}%`;

  const [
    applicantResults,
    clientResults,
    contactResults,
    missionResults,
    callbackResults,
  ] = await Promise.all([
    // Search applicants
    db
      .select({
        id: applicants.id,
        firstName: applicants.firstName,
        lastName: applicants.lastName,
        email: applicants.email,
        phone: applicants.phone,
        city: applicants.city,
        currentJobTitle: applicants.currentJobTitle,
      })
      .from(applicants)
      .where(
        or(
          ilike(applicants.firstName, searchTerm),
          ilike(applicants.lastName, searchTerm),
          ilike(applicants.email, searchTerm),
          ilike(applicants.phone, searchTerm),
          ilike(applicants.city, searchTerm),
          ilike(applicants.currentJobTitle, searchTerm),
          ilike(applicants.notes, searchTerm)
        )
      )
      .limit(20),

    // Search clients
    db
      .select({
        id: clients.id,
        companyName: clients.companyName,
        contactName: clients.contactName,
        contactEmail: clients.contactEmail,
        city: clients.city,
      })
      .from(clients)
      .where(
        or(
          ilike(clients.companyName, searchTerm),
          ilike(clients.contactName, searchTerm),
          ilike(clients.contactEmail, searchTerm),
          ilike(clients.notes, searchTerm)
        )
      )
      .limit(20),

    // Search contacts
    db
      .select({
        id: contacts.id,
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        email: contacts.email,
        phone: contacts.phone,
        city: contacts.city,
        role: contacts.role,
      })
      .from(contacts)
      .where(
        or(
          ilike(contacts.firstName, searchTerm),
          ilike(contacts.lastName, searchTerm),
          ilike(contacts.email, searchTerm),
          ilike(contacts.phone, searchTerm),
          ilike(contacts.city, searchTerm),
          ilike(contacts.notes, searchTerm)
        )
      )
      .limit(20),

    // Search missions
    db
      .select({
        id: missions.id,
        title: missions.title,
        location: missions.location,
        status: missions.status,
      })
      .from(missions)
      .where(
        or(
          ilike(missions.title, searchTerm),
          ilike(missions.description, searchTerm),
          ilike(missions.location, searchTerm),
          ilike(missions.notes, searchTerm)
        )
      )
      .limit(20),

    // Search callbacks
    db
      .select({
        id: callbacks.id,
        name: callbacks.name,
        company: callbacks.company,
        phone: callbacks.phone,
        reason: callbacks.reason,
        status: callbacks.status,
      })
      .from(callbacks)
      .where(
        or(
          ilike(callbacks.name, searchTerm),
          ilike(callbacks.company, searchTerm),
          ilike(callbacks.phone, searchTerm),
          ilike(callbacks.reason, searchTerm),
          ilike(callbacks.notes, searchTerm)
        )
      )
      .limit(20),
  ]);

  return {
    applicants: applicantResults,
    clients: clientResults,
    contacts: contactResults,
    missions: missionResults,
    callbacks: callbackResults,
  };
}
