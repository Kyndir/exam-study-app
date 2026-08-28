import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'

export default async function ReferencesPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: references, error } = await supabase
    .from('references')
    .select('*')
    .order('id', { ascending: true })

  return (
    <div>
      <Nav userEmail={user.email} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Study References</h1>
          <p className="text-gray-400 mt-1">
            Official Salesforce documentation and resources used in this exam prep platform.
          </p>
        </div>

        {error ? (
          <p className="text-red-400">Failed to load references.</p>
        ) : (
          <div className="bg-surface-1 rounded-2xl border border-surface-4 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-4">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Title
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Publisher
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Date Accessed
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-4">
                  {references?.map((ref) => (
                    <tr key={ref.id} className="hover:bg-surface-2 transition">
                      <td className="px-5 py-3.5 text-gray-200 font-medium">{ref.title}</td>
                      <td className="px-5 py-3.5 text-gray-400">{ref.publisher ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {ref.date_accessed
                          ? new Date(ref.date_accessed).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        {ref.url ? (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-teal hover:text-teal/80 transition"
                          >
                            Visit
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-surface-4">
              {references?.map((ref) => (
                <div key={ref.id} className="px-4 py-4">
                  <p className="font-medium text-gray-200 text-sm mb-1">{ref.title}</p>
                  {ref.publisher && (
                    <p className="text-xs text-gray-500 mb-1">{ref.publisher}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    {ref.date_accessed && (
                      <span className="text-xs text-gray-600">
                        {new Date(ref.date_accessed).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal hover:underline"
                      >
                        Visit →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {references && (
          <p className="text-xs text-gray-600 mt-4 text-center">
            {references.length} references
          </p>
        )}
      </main>
    </div>
  )
}
