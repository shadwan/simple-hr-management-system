export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { getContact } from "../actions";
import { getNotes } from "../../notes/actions";
import { StatusBadge } from "@/components/FormFields";
import { NotesSection } from "@/components/NotesSection";
import { Pencil, ArrowLeft, ExternalLink, User } from "lucide-react";

export default async function ViewContactPage({
  params,
}: {
  params: { id: string };
}) {
  const contact = await getContact(parseInt(params.id));
  
  if (!contact) {
    notFound();
  }

  const notesList = await getNotes("contact", contact.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/contacts" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h1>
          </div>
          <StatusBadge status={contact.status} />
        </div>
        <Link href={`/contacts/${contact.id}/edit`} className="btn btn-primary flex items-center gap-2">
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
                <dd className="font-medium">{contact.firstName} {contact.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Role / Function</dt>
                <dd className="font-medium">{contact.role || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="font-medium">
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  ) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Phone</dt>
                <dd className="font-medium">
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  ) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">LinkedIn</dt>
                <dd className="font-medium">
                  {contact.linkedinUrl ? (
                    <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      View Profile <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : "-"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Location</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">City</dt>
                <dd className="font-medium">{contact.city || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Country</dt>
                <dd className="font-medium">{contact.country || "-"}</dd>
              </div>
            </dl>
          </div>

          <NotesSection 
            entityType="contact" 
            entityId={contact.id} 
            notes={notesList} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {contact.clientId && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Company</h2>
              <Link
                href={`/clients/${contact.clientId}`}
                className="text-blue-600 hover:underline font-medium"
              >
                View Client
              </Link>
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Status</h2>
            <StatusBadge status={contact.status} />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Timestamps</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium">{new Date(contact.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium">{new Date(contact.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
