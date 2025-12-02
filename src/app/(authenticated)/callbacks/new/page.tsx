"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createCallback } from "../actions";
import { NotesInput, type NoteWithTimestamp } from "@/components/NotesSection";

type SelectOption = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
};

export default function NewCallbackPage() {
  const [notes, setNotes] = useState<NoteWithTimestamp[]>([]);
  const [applicants, setApplicants] = useState<SelectOption[]>([]);
  const [contacts, setContacts] = useState<SelectOption[]>([]);
  const [selectedType, setSelectedType] = useState<"manual" | "applicant" | "contact">("manual");
  const [selectedApplicant, setSelectedApplicant] = useState<string>("");
  const [selectedContact, setSelectedContact] = useState<string>("");
  
  // Auto-fill fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch applicants and contacts for selection
    Promise.all([
      fetch("/api/callbacks/applicants").then(res => res.json()),
      fetch("/api/callbacks/contacts").then(res => res.json()),
    ]).then(([applicantsData, contactsData]) => {
      setApplicants(applicantsData);
      setContacts(contactsData);
    }).catch(console.error);
  }, []);

  const handleTypeChange = (type: "manual" | "applicant" | "contact") => {
    setSelectedType(type);
    setSelectedApplicant("");
    setSelectedContact("");
    setName("");
    setPhone("");
    setEmail("");
  };

  const handleApplicantChange = (applicantId: string) => {
    setSelectedApplicant(applicantId);
    setSelectedContact("");
    
    if (applicantId) {
      const applicant = applicants.find(a => a.id === parseInt(applicantId));
      if (applicant) {
        setName(`${applicant.firstName} ${applicant.lastName}`);
        setPhone(applicant.phone || "");
        setEmail(applicant.email || "");
      }
    } else {
      setName("");
      setPhone("");
      setEmail("");
    }
  };

  const handleContactChange = (contactId: string) => {
    setSelectedContact(contactId);
    setSelectedApplicant("");
    
    if (contactId) {
      const contact = contacts.find(c => c.id === parseInt(contactId));
      if (contact) {
        setName(`${contact.firstName} ${contact.lastName}`);
        setPhone(contact.phone || "");
        setEmail(contact.email || "");
      }
    } else {
      setName("");
      setPhone("");
      setEmail("");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Callback</h1>
      </div>

      <form action={createCallback} className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Who to Call Back</h2>
            
            <div className="mb-4">
              <label className="label">Select Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="callbackType"
                    checked={selectedType === "applicant"}
                    onChange={() => handleTypeChange("applicant")}
                    className="w-4 h-4"
                  />
                  <span>Applicant</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="callbackType"
                    checked={selectedType === "contact"}
                    onChange={() => handleTypeChange("contact")}
                    className="w-4 h-4"
                  />
                  <span>Contact</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="callbackType"
                    checked={selectedType === "manual"}
                    onChange={() => handleTypeChange("manual")}
                    className="w-4 h-4"
                  />
                  <span>Manual Entry</span>
                </label>
              </div>
            </div>

            {selectedType === "applicant" && (
              <div className="mb-4">
                <label className="label">Select Applicant *</label>
                <select
                  name="applicantId"
                  value={selectedApplicant}
                  onChange={(e) => handleApplicantChange(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">-- Select an applicant --</option>
                  {applicants.map((applicant) => (
                    <option key={applicant.id} value={applicant.id}>
                      {applicant.firstName} {applicant.lastName} {applicant.phone ? `(${applicant.phone})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedType === "contact" && (
              <div className="mb-4">
                <label className="label">Select Contact *</label>
                <select
                  name="contactId"
                  value={selectedContact}
                  onChange={(e) => handleContactChange(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">-- Select a contact --</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} {contact.phone ? `(${contact.phone})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            
            <div className="mb-4">
              <label className="label">Name *</label>
              <input
                type="text"
                name="name"
                required
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={selectedType !== "manual"}
              />
            </div>
            
            <div className="mb-4">
              <label className="label">Company</label>
              <input type="text" name="company" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                readOnly={selectedType !== "manual"}
              />
            </div>
            
            <div className="mb-4">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={selectedType !== "manual"}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Callback Details</h2>
            
            <div className="mb-4">
              <label className="label">Reason</label>
              <input type="text" name="reason" className="input" placeholder="Reason for callback..." />
            </div>
            
            <div className="mb-4">
              <label className="label">Callback Date & Time</label>
              <input type="datetime-local" name="callbackDate" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input" defaultValue="pending">
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <NotesInput notes={notes} onChange={setNotes} />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Callback
          </button>
          <Link href="/callbacks" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
