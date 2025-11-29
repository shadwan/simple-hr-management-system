import Link from "next/link";
import { getMissions, deleteMission } from "./actions";
import { StatusBadge } from "@/components/FormFields";
import { DeleteButton } from "@/components/DeleteButton";
import { Pencil, Plus, Eye } from "lucide-react";

export default async function MissionsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  const missions = await getMissions(searchParams.search, searchParams.status);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
        <Link href="/missions/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Mission
        </Link>
      </div>

      <div className="mb-6">
        <form className="flex gap-4 flex-wrap">
          <input
            type="text"
            name="search"
            placeholder="Search by title, client, location..."
            defaultValue={searchParams.search}
            className="input max-w-md"
          />
          <select
            name="status"
            defaultValue={searchParams.status || "all"}
            className="input w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
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
              <th>Title</th>
              <th>Client</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {missions.map((mission) => (
              <tr key={mission.id}>
                <td className="font-medium">
                  <Link href={`/missions/${mission.id}`} className="text-blue-600 hover:underline">
                    {mission.title}
                  </Link>
                </td>
                <td>{mission.clientName || "-"}</td>
                <td>{mission.location || "-"}</td>
                <td>{mission.startDate || "-"}</td>
                <td>
                  <StatusBadge status={mission.status} />
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/missions/${mission.id}`}
                      className="text-gray-600 hover:text-gray-800"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/missions/${mission.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteMission(mission.id);
                      }}
                      confirmMessage="Are you sure you want to delete this mission?"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {missions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No missions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
