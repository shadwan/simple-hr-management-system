import Link from "next/link";
import { db } from "@/db";
import { applicants, clients, contacts, missions, callbacks } from "@/db/schema";
import { count, eq } from "drizzle-orm";

async function getStats() {
  const [
    applicantCount,
    clientCount,
    contactCount,
    missionCount,
    callbackPendingCount,
  ] = await Promise.all([
    db.select({ count: count() }).from(applicants),
    db.select({ count: count() }).from(clients),
    db.select({ count: count() }).from(contacts),
    db.select({ count: count() }).from(missions),
    db.select({ count: count() }).from(callbacks).where(eq(callbacks.status, "pending")),
  ]);

  return {
    applicants: applicantCount[0].count,
    clients: clientCount[0].count,
    contacts: contactCount[0].count,
    missions: missionCount[0].count,
    pendingCallbacks: callbackPendingCount[0].count,
  };
}

export default async function Dashboard() {
  const stats = await getStats();

  const cards = [
    { name: "Applicants", value: stats.applicants, href: "/applicants", color: "bg-blue-500" },
    { name: "Clients", value: stats.clients, href: "/clients", color: "bg-green-500" },
    { name: "Contacts", value: stats.contacts, href: "/contacts", color: "bg-purple-500" },
    { name: "Missions", value: stats.missions, href: "/missions", color: "bg-orange-500" },
    { name: "Pending Callbacks", value: stats.pendingCallbacks, href: "/callbacks", color: "bg-red-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="card hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-xl font-bold">{card.value}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{card.name}</h3>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/applicants/new" className="btn btn-primary">
            Add Applicant
          </Link>
          <Link href="/clients/new" className="btn btn-primary">
            Add Client
          </Link>
          <Link href="/missions/new" className="btn btn-primary">
            Add Mission
          </Link>
          <Link href="/callbacks/new" className="btn btn-primary">
            Add Callback
          </Link>
        </div>
      </div>
    </div>
  );
}
