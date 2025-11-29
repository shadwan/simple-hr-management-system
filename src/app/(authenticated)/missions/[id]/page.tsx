import Link from "next/link";
import { notFound } from "next/navigation";
import { getMission, getMissionApplicants } from "../actions";
import { getNotes } from "../../notes/actions";
import { StatusBadge } from "@/components/FormFields";
import { NotesSection } from "@/components/NotesSection";
import { Pencil, ArrowLeft, Briefcase, MapPin, Calendar, Users } from "lucide-react";

export default async function ViewMissionPage({
  params,
}: {
  params: { id: string };
}) {
  const mission = await getMission(parseInt(params.id));
  
  if (!mission) {
    notFound();
  }

  const missionApplicants = await getMissionApplicants(mission.id);
  const notesList = await getNotes("mission", mission.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/missions" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">{mission.title}</h1>
          </div>
          <StatusBadge status={mission.status} />
        </div>
        <Link href={`/missions/${mission.id}/edit`} className="btn btn-primary flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Mission Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Title</dt>
                <dd className="font-medium">{mission.title}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Client</dt>
                <dd className="font-medium">
                  {mission.clientId ? (
                    <Link href={`/clients/${mission.clientId}`} className="text-blue-600 hover:underline">
                      View Client
                    </Link>
                  ) : "-"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm text-gray-500">Description</dt>
                <dd className="font-medium whitespace-pre-wrap">{mission.description || "-"}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm text-gray-500">Required Skills</dt>
                <dd className="font-medium whitespace-pre-wrap">{mission.requiredSkills || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Schedule & Location</h2>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Location
                </dt>
                <dd className="font-medium">{mission.location || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Start Date
                </dt>
                <dd className="font-medium">{mission.startDate || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> End Date
                </dt>
                <dd className="font-medium">{mission.endDate || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Assigned Applicants ({missionApplicants.length})
            </h2>
            {missionApplicants.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {missionApplicants.map((ma) => (
                  <div key={ma.id} className="py-3">
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
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No applicants assigned to this mission yet.
              </p>
            )}
            <div className="mt-4 pt-4 border-t">
              <Link href={`/missions/${mission.id}/edit`} className="text-blue-600 hover:underline text-sm">
                Manage applicants in edit mode
              </Link>
            </div>
          </div>

          <NotesSection 
            entityType="mission" 
            entityId={mission.id} 
            notes={notesList} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Status</h2>
            <StatusBadge status={mission.status} />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Timestamps</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium">{new Date(mission.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium">{new Date(mission.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
