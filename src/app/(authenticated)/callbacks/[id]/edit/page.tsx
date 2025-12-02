export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCallback, updateCallback } from "../../actions";
import { ArrowLeft } from "lucide-react";

function formatDateTimeLocal(date: Date | null) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default async function EditCallbackPage({
  params,
}: {
  params: { id: string };
}) {
  const callback = await getCallback(parseInt(params.id));
  
  if (!callback) {
    notFound();
  }

  const updateCallbackWithId = updateCallback.bind(null, callback.id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/callbacks/${callback.id}`} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Callback</h1>
      </div>

      <form action={updateCallbackWithId} className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            
            <div className="mb-4">
              <label className="label">Name *</label>
              <input type="text" name="name" required className="input" defaultValue={callback.name} />
            </div>
            
            <div className="mb-4">
              <label className="label">Company</label>
              <input type="text" name="company" className="input" defaultValue={callback.company || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Phone</label>
              <input type="tel" name="phone" className="input" defaultValue={callback.phone || ""} />
            </div>
            
            <div className="mb-4">
              <label className="label">Email</label>
              <input type="email" name="email" className="input" defaultValue={callback.email || ""} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Callback Details</h2>
            
            <div className="mb-4">
              <label className="label">Reason</label>
              <input type="text" name="reason" className="input" defaultValue={callback.reason || ""} placeholder="Reason for callback..." />
            </div>
            
            <div className="mb-4">
              <label className="label">Callback Date & Time</label>
              <input 
                type="datetime-local" 
                name="callbackDate" 
                className="input" 
                defaultValue={formatDateTimeLocal(callback.callbackDate)}
              />
            </div>
            
            <div className="mb-4">
              <label className="label">Status</label>
              <select name="status" className="input" defaultValue={callback.status}>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="label">Notes</label>
              <textarea name="notes" rows={4} className="input" defaultValue={callback.notes || ""} placeholder="Additional notes..."></textarea>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <Link href={`/callbacks/${callback.id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
