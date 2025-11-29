"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createMission } from "../actions";
import { NotesInput } from "@/components/NotesSection";
import type { Client } from "@/db/schema";

export default function NewMissionPage() {
  const [notes, setNotes] = useState<string[]>([]);
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Mission</h1>
      </div>

      <form action={createMission} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Mission Details</h2>
            
            <div className="mb-4">
              <label className="label">Title *</label>
              <input type="text" name="title" required className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Client</label>
              <select name="clientId" className="input">
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="label">Description</label>
              <textarea name="description" rows={4} className="input" placeholder="Mission description..."></textarea>
            </div>
            
            <div className="mb-4">
              <label className="label">Required Skills</label>
              <textarea name="requiredSkills" rows={3} className="input" placeholder="e.g., React, Node.js, TypeScript..."></textarea>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Schedule & Status</h2>
            
            <div className="mb-4">
              <label className="label">Location</label>
              <input type="text" name="location" className="input" placeholder="e.g., Remote, Paris, On-site" />
            </div>
            
            <div className="mb-4">
              <label className="label">Start Date</label>
              <input type="date" name="startDate" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">End Date</label>
              <input type="date" name="endDate" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <NotesInput notes={notes} onChange={setNotes} />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Mission
          </button>
          <Link href="/missions" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
