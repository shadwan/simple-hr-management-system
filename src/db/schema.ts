import { pgTable, serial, varchar, text, timestamp, date, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  vatNumber: varchar("vat_number", { length: 50 }),
  address: text("address"),
  postalCode: varchar("postal_code", { length: 20 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  contactName: varchar("contact_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  additionalContact: text("additional_contact"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  role: varchar("role", { length: 100 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Applicants table
export const applicants = pgTable("applicants", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  address: text("address"),
  postalCode: varchar("postal_code", { length: 20 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  currentJobTitle: varchar("current_job_title", { length: 255 }),
  currentEmployer: varchar("current_employer", { length: 255 }),
  desiredPosition: varchar("desired_position", { length: 255 }),
  availability: varchar("availability", { length: 100 }),
  noticePeriod: varchar("notice_period", { length: 100 }),
  salaryExpectation: varchar("salary_expectation", { length: 100 }),
  cvFilename: varchar("cv_filename", { length: 500 }),
  extraFilename: varchar("extra_filename", { length: 500 }),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Missions table
export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  description: text("description"),
  requiredSkills: text("required_skills"),
  location: varchar("location", { length: 255 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Mission-Applicant junction table (many-to-many)
export const missionApplicants = pgTable("mission_applicants", {
  id: serial("id").primaryKey(),
  missionId: integer("mission_id").references(() => missions.id, { onDelete: "cascade" }).notNull(),
  applicantId: integer("applicant_id").references(() => applicants.id, { onDelete: "cascade" }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notes table - polymorphic notes for all entities
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // 'applicant', 'client', 'contact', 'mission', 'callback'
  entityId: integer("entity_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Callbacks table
export const callbacks = pgTable("callbacks", {
  id: serial("id").primaryKey(),
  // Link to applicant or contact (one or the other, or manual entry)
  applicantId: integer("applicant_id").references(() => applicants.id, { onDelete: "set null" }),
  contactId: integer("contact_id").references(() => contacts.id, { onDelete: "set null" }),
  // Manual entry fields (used when no applicant/contact selected)
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  reason: varchar("reason", { length: 500 }),
  notes: text("notes"),
  callbackDate: timestamp("callback_date"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  contacts: many(contacts),
  missions: many(missions),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  client: one(clients, {
    fields: [contacts.clientId],
    references: [clients.id],
  }),
  callbacks: many(callbacks),
}));

export const missionsRelations = relations(missions, ({ one, many }) => ({
  client: one(clients, {
    fields: [missions.clientId],
    references: [clients.id],
  }),
  missionApplicants: many(missionApplicants),
}));

export const applicantsRelations = relations(applicants, ({ many }) => ({
  missionApplicants: many(missionApplicants),
  callbacks: many(callbacks),
}));

export const missionApplicantsRelations = relations(missionApplicants, ({ one }) => ({
  mission: one(missions, {
    fields: [missionApplicants.missionId],
    references: [missions.id],
  }),
  applicant: one(applicants, {
    fields: [missionApplicants.applicantId],
    references: [applicants.id],
  }),
}));

export const callbacksRelations = relations(callbacks, ({ one }) => ({
  applicant: one(applicants, {
    fields: [callbacks.applicantId],
    references: [applicants.id],
  }),
  contact: one(contacts, {
    fields: [callbacks.contactId],
    references: [contacts.id],
  }),
}));

// Types
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Applicant = typeof applicants.$inferSelect;
export type NewApplicant = typeof applicants.$inferInsert;
export type Mission = typeof missions.$inferSelect;
export type NewMission = typeof missions.$inferInsert;
export type MissionApplicant = typeof missionApplicants.$inferSelect;
export type NewMissionApplicant = typeof missionApplicants.$inferInsert;
export type Callback = typeof callbacks.$inferSelect;
export type NewCallback = typeof callbacks.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
