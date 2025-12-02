export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getApplicants, deleteApplicant } from "./actions";
import { StatusBadge } from "@/components/FormFields";
import { DeleteButton } from "@/components/DeleteButton";
import { Pencil, Plus, FileText, Eye } from "lucide-react";

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const applicants = await getApplicants(searchParams.search);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <Link href="/applicants/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Applicant
        </Link>
      </div>

      <div className="mb-6">
        <form className="flex gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name, email, city, job title..."
            defaultValue={searchParams.search}
            className="input max-w-md"
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Current Position</th>
              <th>Status</th>
              <th>CV</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <tr key={applicant.id}>
                <td className="font-medium">
                  <Link href={`/applicants/${applicant.id}`} className="text-blue-600 hover:underline">
                    {applicant.firstName} {applicant.lastName}
                  </Link>
                </td>
                <td>{applicant.email}</td>
                <td>{applicant.phone}</td>
                <td>{applicant.city}</td>
                <td>{applicant.currentJobTitle}</td>
                <td>
                  <StatusBadge status={applicant.status} />
                </td>
                <td>
                  {applicant.cvFilename && (
                    <a
                      href={`/uploads/${applicant.cvFilename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      Open CV
                    </a>
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/applicants/${applicant.id}`}
                      className="text-gray-600 hover:text-gray-800"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/applicants/${applicant.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteApplicant(applicant.id);
                      }}
                      confirmMessage="Are you sure you want to delete this applicant?"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {applicants.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No applicants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
