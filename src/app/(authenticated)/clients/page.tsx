import Link from "next/link";
import { getClients, deleteClient } from "./actions";
import { StatusBadge } from "@/components/FormFields";
import { DeleteButton } from "@/components/DeleteButton";
import { Pencil, Plus, Eye } from "lucide-react";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const clients = await getClients(searchParams.search);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Link href="/clients/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      <div className="mb-6">
        <form className="flex gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by company, contact, email, city..."
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
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="font-medium">
                  <Link href={`/clients/${client.id}`} className="text-blue-600 hover:underline">
                    {client.companyName}
                  </Link>
                </td>
                <td>{client.contactName}</td>
                <td>{client.contactEmail}</td>
                <td>{client.contactPhone}</td>
                <td>{client.city}</td>
                <td>
                  <StatusBadge status={client.status} />
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-gray-600 hover:text-gray-800"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/clients/${client.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteClient(client.id);
                      }}
                      confirmMessage="Are you sure you want to delete this client?"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
