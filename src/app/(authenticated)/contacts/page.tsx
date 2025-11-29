import Link from "next/link";
import { getContacts, deleteContact } from "./actions";
import { StatusBadge } from "@/components/FormFields";
import { DeleteButton } from "@/components/DeleteButton";
import { Pencil, Plus, Eye } from "lucide-react";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const contacts = await getContacts(searchParams.search);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <Link href="/contacts/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </Link>
      </div>

      <div className="mb-6">
        <form className="flex gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name, email, city, role, company..."
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
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="font-medium">
                  <Link href={`/contacts/${contact.id}`} className="text-blue-600 hover:underline">
                    {contact.firstName} {contact.lastName}
                  </Link>
                </td>
                <td>{contact.clientName || "-"}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.city}</td>
                <td>{contact.role}</td>
                <td>
                  <StatusBadge status={contact.status} />
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="text-gray-600 hover:text-gray-800"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/contacts/${contact.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteContact(contact.id);
                      }}
                      confirmMessage="Are you sure you want to delete this contact?"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
