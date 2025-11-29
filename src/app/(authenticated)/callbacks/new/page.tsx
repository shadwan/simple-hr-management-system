"use client";

import { useState } from "react";
import Link from "next/link";
import { createCallback } from "../actions";
import { NotesInput, type NoteWithTimestamp } from "@/components/NotesSection";

export default function NewCallbackPage() {
  const [notes, setNotes] = useState<NoteWithTimestamp[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Callback</h1>
      </div>

      <form action={createCallback} className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            
            <div className="mb-4">
              <label className="label">Name *</label>
              <input type="text" name="name" required className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Company</label>
              <input type="text" name="company" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Phone</label>
              <input type="tel" name="phone" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Email</label>
              <input type="email" name="email" className="input" />
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
