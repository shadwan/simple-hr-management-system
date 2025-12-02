export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientWithMissions } from "../actions";
import { getNotes } from "../../notes/actions";
import { StatusBadge } from "@/components/FormFields";
import { NotesSection } from "@/components/NotesSection";
import { Pencil, ArrowLeft, Building2 } from "lucide-react";

export default async function ViewClientPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getClientWithMissions(parseInt(params.id));
  
  if (!data) {
    notFound();
  }

  const { client, missions } = data;
  const notesList = await getNotes("client", client.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">{client.companyName}</h1>
          </div>
          <StatusBadge status={client.status} />
        </div>
        <Link href={`/clients/${client.id}/edit`} className="btn btn-primary flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Company Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Company Name</dt>
                <dd className="font-medium">{client.companyName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">VAT Number</dt>
                <dd className="font-medium">{client.vatNumber || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Address</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Address</dt>
                <dd className="font-medium">{client.address || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Postal Code</dt>
                <dd className="font-medium">{client.postalCode || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">City</dt>
                <dd className="font-medium">{client.city || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Country</dt>
                <dd className="font-medium">{client.country || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Primary Contact</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Contact Name</dt>
                <dd className="font-medium">{client.contactName || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="font-medium">
                  {client.contactEmail ? (
                    <a href={`mailto:${client.contactEmail}`} className="text-blue-600 hover:underline">
                      {client.contactEmail}
                    </a>
                  ) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Phone</dt>
                <dd className="font-medium">
                  {client.contactPhone ? (
                    <a href={`tel:${client.contactPhone}`} className="text-blue-600 hover:underline">
                      {client.contactPhone}
                    </a>
                  ) : "-"}
                </dd>
              </div>
            </dl>
          </div>

          {client.additionalContact && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Additional Contact</h2>
              <div className="whitespace-pre-wrap text-gray-700">
                {client.additionalContact}
              </div>
            </div>
          )}

          <NotesSection 
            entityType="client" 
            entityId={client.id} 
            notes={notesList} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Status</h2>
            <StatusBadge status={client.status} />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Timestamps</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium">{new Date(client.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Missions ({missions.length})</h2>
            {missions.length > 0 ? (
              <div className="space-y-3">
                {missions.map((mission) => (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-blue-600">{mission.title}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-between mt-1">
                      <span>{mission.location || "No location"}</span>
                      <StatusBadge status={mission.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No missions for this client.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
