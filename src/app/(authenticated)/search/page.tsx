import Link from "next/link";
import { globalSearch, type SearchResults } from "./actions";
import { Search, Users, Building2, UserCircle, Briefcase, Phone } from "lucide-react";
import { StatusBadge } from "@/components/FormFields";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const results: SearchResults = query ? await globalSearch(query) : {
    applicants: [],
    clients: [],
    contacts: [],
    missions: [],
    callbacks: [],
  };

  const totalResults = 
    results.applicants.length + 
    results.clients.length + 
    results.contacts.length + 
    results.missions.length + 
    results.callbacks.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Global Search</h1>
        <form className="flex gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="q"
              placeholder="Search across applicants, clients, contacts, missions, and callbacks..."
              defaultValue={query}
              className="input pl-10 text-lg py-3 w-full"
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary px-8">
            Search
          </button>
        </form>
      </div>

      {query && (
        <p className="text-gray-600 mb-6">
          Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {/* Applicants Results */}
      {results.applicants.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Applicants ({results.applicants.length})
            </h2>
          </div>
          <div className="grid gap-3">
            {results.applicants.map((applicant) => (
              <Link
                key={applicant.id}
                href={`/applicants/${applicant.id}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {applicant.firstName} {applicant.lastName}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                      {applicant.currentJobTitle && (
                        <p>{applicant.currentJobTitle}</p>
                      )}
                      <p>
                        {[applicant.email, applicant.phone, applicant.city]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Clients Results */}
      {results.clients.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Clients ({results.clients.length})
            </h2>
          </div>
          <div className="grid gap-3">
            {results.clients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {client.companyName}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>
                        {[client.contactName, client.contactEmail, client.city]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Contacts Results */}
      {results.contacts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Contacts ({results.contacts.length})
            </h2>
          </div>
          <div className="grid gap-3">
            {results.contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/contacts/${contact.id}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                      {contact.role && <p>{contact.role}</p>}
                      <p>
                        {[contact.email, contact.phone, contact.city]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Missions Results */}
      {results.missions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Missions ({results.missions.length})
            </h2>
          </div>
          <div className="grid gap-3">
            {results.missions.map((mission) => (
              <Link
                key={mission.id}
                href={`/missions/${mission.id}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{mission.title}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {mission.location && <p>{mission.location}</p>}
                    </div>
                  </div>
                  <StatusBadge status={mission.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Callbacks Results */}
      {results.callbacks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Callbacks ({results.callbacks.length})
            </h2>
          </div>
          <div className="grid gap-3">
            {results.callbacks.map((callback) => (
              <Link
                key={callback.id}
                href={`/callbacks/${callback.id}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{callback.name}</h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                      {callback.company && <p>{callback.company}</p>}
                      <p>
                        {[callback.phone, callback.reason]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={callback.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {query && totalResults === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or searching for something else.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!query && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search your HR data</h3>
          <p className="text-gray-600">
            Enter a search term to find applicants, clients, contacts, missions, or callbacks.
          </p>
        </div>
      )}
    </div>
  );
}
