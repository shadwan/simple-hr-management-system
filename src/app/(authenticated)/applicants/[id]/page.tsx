export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplicant } from "../actions";
import { getNotes } from "../../notes/actions";
import { StatusBadge } from "@/components/FormFields";
import { NotesSection } from "@/components/NotesSection";
import { FileText, Pencil, ArrowLeft, ExternalLink } from "lucide-react";

export default async function ViewApplicantPage({
  params,
}: {
  params: { id: string };
}) {
  const applicant = await getApplicant(parseInt(params.id));
  
  if (!applicant) {
    notFound();
  }

  const notesList = await getNotes("applicant", applicant.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/applicants" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {applicant.firstName} {applicant.lastName}
          </h1>
          <StatusBadge status={applicant.status} />
        </div>
        <Link href={`/applicants/${applicant.id}/edit`} className="btn btn-primary flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Full Name</dt>
                <dd className="font-medium">{applicant.firstName} {applicant.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="font-medium">
                  {applicant.email ? (
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {applicant.email}
                    </a>
                  ) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Phone</dt>
                <dd className="font-medium">
                  {applicant.phone ? (
                    <a href={`tel:${applicant.phone}`} className="text-blue-600 hover:underline">
                      {applicant.phone}
                    </a>
                  ) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">LinkedIn</dt>
                <dd className="font-medium">
                  {applicant.linkedinUrl ? (
                    <a href={applicant.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      View Profile <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : "-"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Address</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Address</dt>
                <dd className="font-medium">{applicant.address || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Postal Code</dt>
                <dd className="font-medium">{applicant.postalCode || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">City</dt>
                <dd className="font-medium">{applicant.city || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Country</dt>
                <dd className="font-medium">{applicant.country || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Professional Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Current Job Title</dt>
                <dd className="font-medium">{applicant.currentJobTitle || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Current Employer</dt>
                <dd className="font-medium">{applicant.currentEmployer || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Desired Position</dt>
                <dd className="font-medium">{applicant.desiredPosition || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Availability</dt>
                <dd className="font-medium">{applicant.availability || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Notice Period</dt>
                <dd className="font-medium">{applicant.noticePeriod || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Salary Expectation</dt>
                <dd className="font-medium">{applicant.salaryExpectation || "-"}</dd>
              </div>
            </dl>
          </div>

          <NotesSection 
            entityType="applicant" 
            entityId={applicant.id} 
            notes={notesList} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Documents</h2>
            <div className="space-y-4">
              {applicant.cvFilename ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{applicant.cvFilename}</p>
                  <a
                    href={`/uploads/${applicant.cvFilename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm flex items-center gap-2 w-full justify-center"
                  >
                    <FileText className="w-4 h-4" />
                    Open CV
                  </a>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No CV uploaded</p>
              )}
              
              {applicant.extraFilename && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{applicant.extraFilename}</p>
                  <a
                    href={`/uploads/${applicant.extraFilename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-sm flex items-center gap-2 w-full justify-center"
                  >
                    <FileText className="w-4 h-4" />
                    Open File
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Status</h2>
            <StatusBadge status={applicant.status} />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Timestamps</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium">{new Date(applicant.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium">{new Date(applicant.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
