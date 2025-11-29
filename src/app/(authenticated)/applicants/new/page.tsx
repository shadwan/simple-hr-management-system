"use client";

import { useState } from "react";
import Link from "next/link";
import { createApplicant } from "../actions";
import { NotesInput } from "@/components/NotesSection";

export default function NewApplicantPage() {
  const [notes, setNotes] = useState<string[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Applicant</h1>
      </div>

      <form action={createApplicant} className="card max-w-4xl">
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
              <label className="label">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" className="input" />
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
            <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
            
            <div className="mb-4">
              <label className="label">Current Job Title</label>
              <input type="text" name="currentJobTitle" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Current Employer</label>
              <input type="text" name="currentEmployer" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Desired Position</label>
              <input type="text" name="desiredPosition" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Availability</label>
              <input type="text" name="availability" className="input" placeholder="e.g., Immediate, 2 weeks" />
            </div>
            
            <div className="mb-4">
              <label className="label">Notice Period</label>
              <input type="text" name="noticePeriod" className="input" placeholder="e.g., 1 month" />
            </div>
            
            <div className="mb-4">
              <label className="label">Salary Expectation</label>
              <input type="text" name="salaryExpectation" className="input" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            
            <div className="mb-4">
              <label className="label">CV (PDF only)</label>
              <input type="file" name="cv" accept=".pdf" className="input" />
            </div>
            
            <div className="mb-4">
              <label className="label">Extra Document (optional)</label>
              <input type="file" name="extraFile" className="input" />
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
            Save Applicant
          </button>
          <Link href="/applicants" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
