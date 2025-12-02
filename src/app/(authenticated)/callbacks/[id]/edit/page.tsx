export const dynamic = 'force-dynamic';

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCallback, getApplicantsForSelect, getContactsForSelect, updateCallback } from "../../actions";
import { ArrowLeft } from "lucide-react";
import CallbackEditForm from "./CallbackEditForm";

export default async function EditCallbackPage({
  params,
}: {
  params: { id: string };
}) {
  const callback = await getCallback(parseInt(params.id));
  
  if (!callback) {
    notFound();
  }

  const applicants = await getApplicantsForSelect();
  const contacts = await getContactsForSelect();
  const updateCallbackWithId = updateCallback.bind(null, callback.id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/callbacks/${callback.id}`} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Callback</h1>
      </div>

      <CallbackEditForm
        callback={callback}
        applicants={applicants}
        contacts={contacts}
        updateAction={updateCallbackWithId}
      />
    </div>
  );
}
