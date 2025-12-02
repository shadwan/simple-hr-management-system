"use client";

import { useState } from "react";
import Link from "next/link";

type SelectOption = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
};

type CallbackData = {
  id: number;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  reason: string | null;
  notes: string | null;
  callbackDate: Date | null;
  status: string;
  applicantId: number | null;
  contactId: number | null;
};

function formatDateTimeLocal(date: Date | null) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function CallbackEditForm({
  callback,
  applicants,
  contacts,
  updateAction,
}: {
  callback: CallbackData;
  applicants: SelectOption[];
  contacts: SelectOption[];
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const getInitialType = () => {
    if (callback.applicantId) return "applicant";
    if (callback.contactId) return "contact";
    return "manual";
  };

  const [selectedType, setSelectedType] = useState<"manual" | "applicant" | "contact">(getInitialType());
  const [selectedApplicant, setSelectedApplicant] = useState<string>(callback.applicantId?.toString() || "");
  const [selectedContact, setSelectedContact] = useState<string>(callback.contactId?.toString() || "");
  
  // Auto-fill fields
  const [name, setName] = useState(callback.name);
  const [phone, setPhone] = useState(callback.phone || "");
  const [email, setEmail] = useState(callback.email || "");

  const handleTypeChange = (type: "manual" | "applicant" | "contact") => {
    setSelectedType(type);
    setSelectedApplicant("");
    setSelectedContact("");
    
    if (type === "manual") {
      setName("");
      setPhone("");
      setEmail("");
    }
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
    <form action={updateAction} className="card max-w-2xl">
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
            <input type="text" name="company" className="input" defaultValue={callback.company || ""} />
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
            <input type="text" name="reason" className="input" defaultValue={callback.reason || ""} placeholder="Reason for callback..." />
          </div>
          
          <div className="mb-4">
            <label className="label">Callback Date & Time</label>
            <input 
              type="datetime-local" 
              name="callbackDate" 
              className="input" 
              defaultValue={formatDateTimeLocal(callback.callbackDate)}
            />
          </div>
          
          <div className="mb-4">
            <label className="label">Status</label>
            <select name="status" className="input" defaultValue={callback.status}>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="label">Notes</label>
            <textarea name="notes" rows={4} className="input" defaultValue={callback.notes || ""} placeholder="Additional notes..."></textarea>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
        <Link href={`/callbacks/${callback.id}`} className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
