export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMission,
  updateMission,
  getClients,
  getMissionApplicants,
  getAvailableApplicants,
  addApplicantToMission,
  removeApplicantFromMission,
} from "../../actions";
import { UserPlus, X, ArrowLeft } from "lucide-react";

export default async function EditMissionPage({
  params,
}: {
  params: { id: string };
}) {
  const mission = await getMission(parseInt(params.id));
  
  if (!mission) {
    notFound();
  }

  const clients = await getClients();
  const missionApplicants = await getMissionApplicants(mission.id);
  const availableApplicants = await getAvailableApplicants(mission.id);

  const updateMissionWithId = updateMission.bind(null, mission.id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/missions/${mission.id}`} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Mission</h1>
      </div>

      <form action={updateMissionWithId} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Mission Details</h2>
            
            <div className="mb-4">
              <label className="label">Title *</label>
              <input type="text" name="title" required className="input" defaultValue={mission.title} />
            </div>
            
            <div className="mb-4">
              <label className="label">Client</label>
              <select name="clientId" className="input" defaultValue={mission.clientId || ""}>
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
              <textarea name="description" rows={4} className="input" defaultValue={mission.description || ""}></textarea>
            </div>
            
            <div className="mb-4">
              <label className="label">Required Skills</label>
              <textarea name="requiredSkills" rows={3} className="input" defaultValue={mission.requiredSkills || ""}></textarea>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Schedule & Status</h2>
            
            <div className="mb-4">
              <label className="label">Location</label>
              <input type="text" name="location" className="input" defaultValue={mission.location || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Start Date</label>
              <input type="date" name="startDate" className="input" defaultValue={mission.startDate || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">End Date</label>
              <input type="date" name="endDate" className="input" defaultValue={mission.endDate || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input" defaultValue={mission.status}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <div className="mb-4">
            <label className="label">Notes</label>
            <textarea name="notes" rows={4} className="input" defaultValue={mission.notes || ""}></textarea>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <Link href={`/missions/${mission.id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>

      {/* Applicants Section */}
      <div className="card max-w-4xl mt-6">
        <h2 className="text-lg font-semibold mb-4">Assigned Applicants</h2>
        
        {/* Add Applicant Form */}
        {availableApplicants.length > 0 && (
          <form
            action={async (formData: FormData) => {
              "use server";
              const applicantId = formData.get("applicantId") as string;
              if (applicantId) {
                await addApplicantToMission(parseInt(params.id), parseInt(applicantId));
              }
            }}
            className="flex gap-4 mb-6"
          >
            <select name="applicantId" className="input flex-1">
              <option value="">Select an applicant to add</option>
              {availableApplicants.map((applicant) => (
                <option key={applicant.id} value={applicant.id}>
                  {applicant.firstName} {applicant.lastName} - {applicant.currentJobTitle || "No title"}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add
            </button>
          </form>
        )}

        {/* List of assigned applicants */}
        {missionApplicants.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {missionApplicants.map((ma) => (
              <div key={ma.id} className="flex items-center justify-between py-3">
                <div>
                  <Link
                    href={`/applicants/${ma.applicantId}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {ma.applicantFirstName} {ma.applicantLastName}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {ma.applicantCurrentJobTitle || "No title"} 
                    {ma.applicantEmail && ` - ${ma.applicantEmail}`}
                  </p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await removeApplicantFromMission(parseInt(params.id), ma.applicantId);
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Remove from mission"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No applicants assigned to this mission yet.
          </p>
        )}
      </div>
    </div>
  );
}
