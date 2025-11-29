import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientWithMissions, updateClient } from "../../actions";
import { ArrowLeft } from "lucide-react";

export default async function EditClientPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getClientWithMissions(parseInt(params.id));
  
  if (!data) {
    notFound();
  }

  const { client } = data;
  const updateClientWithId = updateClient.bind(null, client.id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/clients/${client.id}`} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
      </div>

      <form action={updateClientWithId} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
            
            <div className="mb-4">
              <label className="label">Company Name *</label>
              <input type="text" name="companyName" required className="input" defaultValue={client.companyName} />
            </div>
            
            <div className="mb-4">
              <label className="label">VAT Number</label>
              <input type="text" name="vatNumber" className="input" defaultValue={client.vatNumber || ""} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Address</h2>
            
            <div className="mb-4">
              <label className="label">Address</label>
              <input type="text" name="address" className="input" defaultValue={client.address || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Postal Code</label>
              <input type="text" name="postalCode" className="input" defaultValue={client.postalCode || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">City</label>
              <input type="text" name="city" className="input" defaultValue={client.city || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Country</label>
              <input type="text" name="country" className="input" defaultValue={client.country || ""} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Primary Contact</h2>
            
            <div className="mb-4">
              <label className="label">Contact Name</label>
              <input type="text" name="contactName" className="input" defaultValue={client.contactName || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Contact Email</label>
              <input type="email" name="contactEmail" className="input" defaultValue={client.contactEmail || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Contact Phone</label>
              <input type="tel" name="contactPhone" className="input" defaultValue={client.contactPhone || ""} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            
            <div className="mb-4">
              <label className="label">Additional Contact</label>
              <textarea 
                name="additionalContact" 
                rows={3} 
                className="input" 
                defaultValue={client.additionalContact || ""}
                placeholder="Additional contact persons or information..."
              ></textarea>
            </div>

            <h2 className="text-lg font-semibold mb-4 mt-6">Status</h2>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input" defaultValue={client.status}>
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
            <textarea name="notes" rows={4} className="input" defaultValue={client.notes || ""} placeholder="Add notes about this client..."></textarea>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <Link href={`/clients/${client.id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
