"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../actions";
import { NotesInput, type NoteWithTimestamp } from "@/components/NotesSection";

export default function NewClientPage() {
  const [notes, setNotes] = useState<NoteWithTimestamp[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
      </div>

      <form action={createClient} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
            
            <div className="mb-4">
              <label className="label">Company Name *</label>
              <input type="text" name="companyName" required className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">VAT Number</label>
              <input type="text" name="vatNumber" className="input" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Address</h2>
            
            <div className="mb-4">
              <label className="label">Address</label>
              <input type="text" name="address" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Postal Code</label>
              <input type="text" name="postalCode" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">City</label>
              <input type="text" name="city" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Country</label>
              <input type="text" name="country" className="input" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Primary Contact</h2>
            
            <div className="mb-4">
              <label className="label">Contact Name</label>
              <input type="text" name="contactName" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Contact Email</label>
              <input type="email" name="contactEmail" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Contact Phone</label>
              <input type="tel" name="contactPhone" className="input" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            
            <div className="mb-4">
              <label className="label">Additional Contact</label>
              <textarea 
                name="additionalContact" 
                rows={3} 
                className="input" 
                placeholder="Additional contact persons or information..."
              ></textarea>
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
            Save Client
          </button>
          <Link href="/clients" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
