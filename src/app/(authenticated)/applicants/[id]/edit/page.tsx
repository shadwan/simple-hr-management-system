import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplicant, updateApplicant } from "../../actions";
import { FileText, ArrowLeft } from "lucide-react";

export default async function EditApplicantPage({
  params,
}: {
  params: { id: string };
}) {
  const applicant = await getApplicant(parseInt(params.id));
  
  if (!applicant) {
    notFound();
  }

  const updateApplicantWithId = updateApplicant.bind(null, applicant.id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/applicants/${applicant.id}`} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Applicant</h1>
      </div>

      <form action={updateApplicantWithId} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            
            <div className="mb-4">
              <label className="label">First Name *</label>
              <input type="text" name="firstName" required className="input" defaultValue={applicant.firstName} />
            </div>
            
            <div className="mb-4">
              <label className="label">Last Name *</label>
              <input type="text" name="lastName" required className="input" defaultValue={applicant.lastName} />
            </div>
            
            <div className="mb-4">
              <label className="label">Email</label>
              <input type="email" name="email" className="input" defaultValue={applicant.email || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Phone</label>
              <input type="tel" name="phone" className="input" defaultValue={applicant.phone || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" className="input" defaultValue={applicant.linkedinUrl || ""} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Address</h2>
            
            <div className="mb-4">
              <label className="label">Address</label>
              <input type="text" name="address" className="input" defaultValue={applicant.address || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Postal Code</label>
              <input type="text" name="postalCode" className="input" defaultValue={applicant.postalCode || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">City</label>
              <input type="text" name="city" className="input" defaultValue={applicant.city || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Country</label>
              <input type="text" name="country" className="input" defaultValue={applicant.country || ""} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
            
            <div className="mb-4">
              <label className="label">Current Job Title</label>
              <input type="text" name="currentJobTitle" className="input" defaultValue={applicant.currentJobTitle || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Current Employer</label>
              <input type="text" name="currentEmployer" className="input" defaultValue={applicant.currentEmployer || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Desired Position</label>
              <input type="text" name="desiredPosition" className="input" defaultValue={applicant.desiredPosition || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Availability</label>
              <input type="text" name="availability" className="input" defaultValue={applicant.availability || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Notice Period</label>
              <input type="text" name="noticePeriod" className="input" defaultValue={applicant.noticePeriod || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Salary Expectation</label>
              <input type="text" name="salaryExpectation" className="input" defaultValue={applicant.salaryExpectation || ""} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            
            {applicant.cvFilename && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Current CV: {applicant.cvFilename}</p>
                <a
                  href={`/uploads/${applicant.cvFilename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  Open CV
                </a>
              </div>
            )}
            
            <div className="mb-4">
              <label className="label">Upload New CV (PDF only)</label>
              <input type="file" name="cv" accept=".pdf" className="input" />
            </div>
            
            {applicant.extraFilename && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Extra File: {applicant.extraFilename}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="label">Upload New Extra Document</label>
              <input type="file" name="extraFile" className="input" />
            </div>

            <h2 className="text-lg font-semibold mb-4 mt-6">Status</h2>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input" defaultValue={applicant.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Notes / History</h2>
          <div className="mb-4">
            <label className="label">Notes</label>
            <textarea name="notes" rows={4} className="input" defaultValue={applicant.notes || ""}></textarea>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <Link href={`/applicants/${applicant.id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
