export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getCallbacks, deleteCallback } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";
import { Pencil, Plus, Phone, Eye, User, Users } from "lucide-react";

function CallbackStatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function CallbacksPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  const callbacksList = await getCallbacks(searchParams.search, searchParams.status);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Callbacks</h1>
        <Link href="/callbacks/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Callback
        </Link>
      </div>

      <div className="mb-6">
        <form className="flex gap-4 flex-wrap">
          <input
            type="text"
            name="search"
            placeholder="Search by name, company, phone, reason..."
            defaultValue={searchParams.search}
            className="input max-w-md"
          />
          <select
            name="status"
            defaultValue={searchParams.status || "all"}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
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
              <th>Linked To</th>
              <th>Phone</th>
              <th>Reason</th>
              <th>Callback Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {callbacksList.map((callback) => {
              const linkedToApplicant = callback.applicantId && callback.applicantFirstName;
              const linkedToContact = callback.contactId && callback.contactFirstName;
              
              return (
                <tr key={callback.id}>
                  <td className="font-medium">
                    <Link href={`/callbacks/${callback.id}`} className="text-blue-600 hover:underline">
                      {callback.name}
                    </Link>
                  </td>
                  <td>
                    {linkedToApplicant && (
                      <Link
                        href={`/applicants/${callback.applicantId}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        {callback.applicantFirstName} {callback.applicantLastName}
                      </Link>
                    )}
                    {linkedToContact && (
                      <Link
                        href={`/contacts/${callback.contactId}`}
                        className="text-purple-600 hover:underline flex items-center gap-1"
                      >
                        <Users className="w-3 h-3" />
                        {callback.contactFirstName} {callback.contactLastName}
                      </Link>
                    )}
                    {!linkedToApplicant && !linkedToContact && (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    {callback.phone ? (
                      <a href={`tel:${callback.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {callback.phone}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="max-w-xs truncate">{callback.reason || "-"}</td>
                  <td>{formatDate(callback.callbackDate)}</td>
                  <td>
                    <CallbackStatusBadge status={callback.status} />
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        href={`/callbacks/${callback.id}`}
                        className="text-gray-600 hover:text-gray-800"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/callbacks/${callback.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteButton
                        action={async () => {
                          "use server";
                          await deleteCallback(callback.id);
                        }}
                        confirmMessage="Are you sure you want to delete this callback?"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {callbacksList.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No callbacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
