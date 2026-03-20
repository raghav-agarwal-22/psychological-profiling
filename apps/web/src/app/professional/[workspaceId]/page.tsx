'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { api, ApiError } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { track } from '@/lib/analytics'

interface Profile {
  id: string
  summary: string
  archetypes: string[]
  generatedAt: string
}

interface Client {
  id: string
  inviteEmail: string | null
  inviteStatus: string
  role: string
  practitionerNotes: string | null
  user: {
    id: string
    email: string
    name: string | null
    profiles: Profile[]
  } | null
}

interface Workspace {
  id: string
  name: string
  professionalTier: string
  seatLimit: number
  subscriptionStatus: string
  trialEndsAt: string | null
  trialDaysLeft: number | null
  clientCount: number
  seatsRemaining: number
  members: Client[]
}

export default function WorkspacePage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const workspaceId = params.workspaceId as string

  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [downloadingReport, setDownloadingReport] = useState(false)

  const fetchWorkspace = useCallback(async () => {
    const token = getToken()
    if (!token) { router.replace('/auth/login'); return }
    try {
      const res = await api.get<{ workspace: Workspace }>(`/api/professional/workspaces/${workspaceId}`, token)
      setWorkspace(res.workspace)
    } catch {
      router.replace('/professional')
    } finally {
      setLoading(false)
    }
  }, [workspaceId, router])

  useEffect(() => {
    fetchWorkspace()
  }, [fetchWorkspace])

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      track('b2b_upgrade_completed', { workspace_id: workspaceId })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    const token = getToken()
    if (!token || !inviteEmail.trim()) return
    setInviting(true)
    setInviteError(null)
    setInviteSuccess(false)
    try {
      await api.post(`/api/professional/workspaces/${workspaceId}/clients`, { email: inviteEmail.trim() }, token)
      setInviteSuccess(true)
      setInviteEmail('')
      await fetchWorkspace()
    } catch (err) {
      setInviteError(err instanceof ApiError ? err.message : 'Failed to send invite')
    } finally {
      setInviting(false)
    }
  }

  async function handleRemoveClient(clientId: string) {
    const token = getToken()
    if (!token) return
    if (!confirm('Remove this client from your workspace?')) return
    await api.del(`/api/professional/workspaces/${workspaceId}/clients/${clientId}`, token).catch(() => null)
    await fetchWorkspace()
    if (selectedClient?.id === clientId) setSelectedClient(null)
  }

  async function handleSaveNotes() {
    const token = getToken()
    if (!token || !selectedClient) return
    setSavingNotes(true)
    try {
      await api.patch(`/api/professional/workspaces/${workspaceId}/clients/${selectedClient.id}`, { notes }, token)
    } finally {
      setSavingNotes(false)
    }
  }

  function openClient(client: Client) {
    setSelectedClient(client)
    setNotes(client.practitionerNotes ?? '')
  }

  async function handleDownloadReport(client: Client) {
    const token = getToken()
    if (!token) return
    setDownloadingReport(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/professional/workspaces/${workspaceId}/clients/${client.id}/report`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!response.ok) throw new Error('Report unavailable')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const name = (client.user?.name ?? client.user?.email ?? 'client').replace(/[^a-z0-9]/gi, '_')
      a.download = `${name}_innermind_profile.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // silently fail — client hasn't completed assessments yet
    } finally {
      setDownloadingReport(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="h-12 w-48 animate-pulse rounded-lg bg-stone-800/50 mb-8" />
        <div className="h-64 animate-pulse rounded-xl bg-stone-800/50" />
      </main>
    )
  }

  if (!workspace) return null

  const clients = workspace.members.filter((m) => m.role !== 'owner')
  const isActive = workspace.subscriptionStatus === 'active'
  const isTrial = workspace.subscriptionStatus === 'trial'
  const isTrialExpired = isTrial && (workspace.trialDaysLeft ?? 0) <= 0
  const canInvite = (isActive || (isTrial && !isTrialExpired)) && workspace.seatsRemaining > 0

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {searchParams.get('checkout') === 'success' && (
        <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400">
          Subscription activated! You can now invite clients.
        </div>
      )}

      {searchParams.get('checkout') === 'trial' && (
        <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-300">
          Your 14-day free trial has started. Invite up to 3 clients — no credit card needed.
        </div>
      )}

      {isTrial && !isTrialExpired && workspace.trialDaysLeft !== null && (
        <div className="mb-6 rounded-xl bg-stone-800/60 border border-stone-700 px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-stone-300">
            <span className="font-medium text-amber-400">{workspace.trialDaysLeft} day{workspace.trialDaysLeft !== 1 ? 's' : ''} left</span> in your free trial
          </p>
          <a
            href={`/professional?upgrade=${workspace.id}`}
            onClick={(e) => { e.preventDefault(); window.location.href = '/professional' }}
            className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Upgrade →
          </a>
        </div>
      )}

      {isTrialExpired && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-red-400">Your trial has expired. Upgrade to invite more clients.</p>
          <a
            href="/professional"
            className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Upgrade →
          </a>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-stone-100">{workspace.name}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {workspace.professionalTier === 'starter' ? 'Pro Business' : 'Team'} plan · {workspace.clientCount}/{workspace.seatLimit} clients
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${isActive ? 'bg-green-500/20 text-green-400' : isTrial ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-700 text-stone-400'}`}>
          {isActive ? 'Active' : isTrial ? 'Trial' : 'Inactive'}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client list */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">Clients</h2>

            {clients.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-600">No clients yet</p>
            ) : (
              <div className="space-y-2">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => openClient(client)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${selectedClient?.id === client.id ? 'bg-stone-800' : 'hover:bg-stone-800/60'}`}
                  >
                    <p className="text-sm text-stone-200 truncate">
                      {client.user?.name ?? client.user?.email ?? client.inviteEmail ?? 'Unknown'}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-600 capitalize">{client.inviteStatus}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Invite form */}
            {canInvite && (
              <form onSubmit={handleInvite} className="mt-4 border-t border-stone-800 pt-4">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="client@email.com"
                  className="mb-2 w-full rounded-lg bg-stone-800 px-3 py-2 text-sm text-stone-100 placeholder-stone-600 outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                {inviteError && <p className="mb-2 text-xs text-red-400">{inviteError}</p>}
                {inviteSuccess && <p className="mb-2 text-xs text-green-400">Invite sent!</p>}
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full rounded-lg bg-amber-500 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
                >
                  {inviting ? 'Sending…' : 'Invite client →'}
                </button>
              </form>
            )}

            {isTrial && workspace.seatsRemaining === 0 && !isTrialExpired && (
              <p className="mt-4 text-center text-xs text-stone-500 border-t border-stone-800 pt-4">
                Trial seat limit reached (3/3).{' '}
                <a href="/professional" className="text-amber-500 hover:underline">Upgrade</a> for more.
              </p>
            )}

            {!isActive && !isTrial && (
              <p className="mt-4 text-center text-xs text-stone-600 border-t border-stone-800 pt-4">
                Activate subscription to invite clients
              </p>
            )}
          </div>
        </div>

        {/* Client detail */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="font-medium text-stone-100">
                    {selectedClient.user?.name ?? selectedClient.user?.email ?? selectedClient.inviteEmail}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {selectedClient.user?.email ?? selectedClient.inviteEmail}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedClient.user?.profiles && selectedClient.user.profiles.length > 0 && (
                    <button
                      onClick={() => handleDownloadReport(selectedClient)}
                      disabled={downloadingReport}
                      className="flex items-center gap-1.5 rounded-lg border border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-stone-600 hover:text-stone-100 disabled:opacity-50"
                    >
                      {downloadingReport ? 'Generating…' : '↓ PDF Report'}
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveClient(selectedClient.id)}
                    className="text-xs text-stone-600 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Latest profile */}
              {selectedClient.user?.profiles && selectedClient.user.profiles.length > 0 ? (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">Latest Profile</h3>
                  {(() => {
                    const profile = selectedClient.user.profiles[0]!
                    return (
                      <div className="rounded-lg bg-stone-800/60 p-4">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {profile.archetypes.map((a) => (
                            <span key={a} className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">{a}</span>
                          ))}
                        </div>
                        <p className="text-sm text-stone-300 line-clamp-4">{profile.summary}</p>
                        <p className="mt-2 text-xs text-stone-600">
                          {new Date(profile.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <p className="mb-6 text-sm text-stone-600">
                  {selectedClient.inviteStatus === 'pending'
                    ? 'Awaiting client to accept invite and complete assessment'
                    : 'Client has not completed any assessments yet'}
                </p>
              )}

              {/* Practitioner notes */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-500">Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Private notes visible only to you…"
                  rows={5}
                  className="w-full rounded-lg bg-stone-800 px-4 py-3 text-sm text-stone-200 placeholder-stone-600 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="mt-2 rounded-lg bg-stone-800 px-4 py-2 text-xs font-medium text-stone-300 transition-colors hover:bg-stone-700 disabled:opacity-50"
                >
                  {savingNotes ? 'Saving…' : 'Save notes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-stone-800 text-sm text-stone-600">
              Select a client to view their profile
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
