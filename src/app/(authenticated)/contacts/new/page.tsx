"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createContact } from "../actions";
import { NotesInput, type NoteWithTimestamp } from "@/components/NotesSection";
import type { Client } from "@/db/schema";

export default function NewContactPage() {
  const [notes, setNotes] = useState<NoteWithTimestamp[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients)
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Contact</h1>
      </div>

      <form action={createContact} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            
            <div className="mb-4">
              <label className="label">First Name *</label>
              <input type="text" name="firstName" required className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Last Name *</label>
              <input type="text" name="lastName" required className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Email</label>
              <input type="email" name="email" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Phone</label>
              <input type="tel" name="phone" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Role / Function</label>
              <input type="text" name="role" className="input" placeholder="e.g., HR Manager, CEO" />
            </div>
            
            <div className="mb-4">
              <label className="label">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" className="input" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Location & Company</h2>
            
            <div className="mb-4">
              <label className="label">City</label>
              <input type="text" name="city" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Country</label>
              <input type="text" name="country" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Client (Company)</label>
              <select name="clientId" className="input">
                <option value="">-- No client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="text-lg font-semibold mb-4 mt-6">Status</h2>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <NotesInput notes={notes} onChange={setNotes} />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Contact
          </button>
          <Link href="/contacts" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
