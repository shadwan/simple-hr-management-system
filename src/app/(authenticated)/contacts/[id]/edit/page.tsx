export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { getContact, getClients, updateContact } from "../../actions";
import { ArrowLeft } from "lucide-react";

export default async function EditContactPage({
  params,
}: {
  params: { id: string };
}) {
  const contact = await getContact(parseInt(params.id));
  const clients = await getClients();
  
  if (!contact) {
    notFound();
  }

  const updateContactWithId = updateContact.bind(null, contact.id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/contacts/${contact.id}`} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Contact</h1>
      </div>

      <form action={updateContactWithId} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            
            <div className="mb-4">
              <label className="label">First Name *</label>
              <input type="text" name="firstName" required className="input" defaultValue={contact.firstName} />
            </div>
            
            <div className="mb-4">
              <label className="label">Last Name *</label>
              <input type="text" name="lastName" required className="input" defaultValue={contact.lastName} />
            </div>
            
            <div className="mb-4">
              <label className="label">Email</label>
              <input type="email" name="email" className="input" defaultValue={contact.email || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Phone</label>
              <input type="tel" name="phone" className="input" defaultValue={contact.phone || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Role / Function</label>
              <input type="text" name="role" className="input" defaultValue={contact.role || ""} placeholder="e.g., HR Manager, CEO" />
            </div>
            
            <div className="mb-4">
              <label className="label">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" className="input" defaultValue={contact.linkedinUrl || ""} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Location & Company</h2>
            
            <div className="mb-4">
              <label className="label">City</label>
              <input type="text" name="city" className="input" defaultValue={contact.city || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Country</label>
              <input type="text" name="country" className="input" defaultValue={contact.country || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Client (Company)</label>
              <select name="clientId" className="input" defaultValue={contact.clientId || ""}>
                <option value="">-- No client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="text-lg font-semibold mb-4 mt-6">Status</h2>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input" defaultValue={contact.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <div className="mb-4">
            <label className="label">Notes</label>
            <textarea name="notes" rows={4} className="input" defaultValue={contact.notes || ""}></textarea>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <Link href={`/contacts/${contact.id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
