export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCallback } from "../actions";
import { getNotes } from "../../notes/actions";
import { StatusBadge } from "@/components/FormFields";
import { NotesSection } from "@/components/NotesSection";
import { Pencil, ArrowLeft, Phone, Mail, Calendar } from "lucide-react";

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ViewCallbackPage({
  params,
}: {
  params: { id: string };
}) {
  const callback = await getCallback(parseInt(params.id));
  
  if (!callback) {
    notFound();
  }

  const notesList = await getNotes("callback", callback.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/callbacks" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">{callback.name}</h1>
          </div>
          <StatusBadge status={callback.status} />
        </div>
        <Link href={`/callbacks/${callback.id}/edit`} className="btn btn-primary flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="font-medium">{callback.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Company</dt>
                <dd className="font-medium">{callback.company || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </dt>
                <dd className="font-medium">
                  {callback.phone ? (
                    <a href={`tel:${callback.phone}`} className="text-blue-600 hover:underline">
                      {callback.phone}
                    </a>
                  ) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </dt>
                <dd className="font-medium">
                  {callback.email ? (
                    <a href={`mailto:${callback.email}`} className="text-blue-600 hover:underline">
                      {callback.email}
                    </a>
                  ) : "-"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Callback Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Reason</dt>
                <dd className="font-medium">{callback.reason || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Callback Date & Time
                </dt>
                <dd className="font-medium text-lg">{formatDate(callback.callbackDate)}</dd>
              </div>
            </dl>
          </div>

          <NotesSection 
            entityType="callback" 
            entityId={callback.id} 
            notes={notesList} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Status</h2>
            <StatusBadge status={callback.status} />
            {callback.status === "pending" && (
              <p className="mt-2 text-sm text-yellow-600">
                This callback is still pending.
              </p>
            )}
          </div>

          {callback.phone && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Quick Actions</h2>
              <a
                href={`tel:${callback.phone}`}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Timestamps</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium">{new Date(callback.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium">{new Date(callback.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
