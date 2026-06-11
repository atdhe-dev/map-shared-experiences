import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Camera, ArrowLeft } from 'lucide-react'
import type { Experience } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  fetchPendingExperiences,
  fetchAllExperiencesForAdmin,
  updateExperienceStatus,
  deleteExperience,
} from '../lib/experiences'
import { getCategory } from '../lib/categories'
import { formatDate, getAuthorDisplay, truncateText } from '../lib/format'
import { Button } from '../components/ui/Button'
import { CategoryChip } from '../components/ui/CategoryChip'
import { LoadingSpinner, EmptyState } from '../components/ui/CategoryChip'
import { AdminCentered, AdminShell } from '../components/admin/AdminShell'

type AdminTab = 'pending' | 'all'
type ActionType = 'approve' | 'reject' | 'delete'

const inputClass =
  'w-full px-4 py-3 rounded-sm border border-stone-light bg-ivory/80 text-sm text-charcoal outline-none focus:ring-1 focus:ring-gold/40 transition-all duration-300'

function statusClass(status: Experience['status']) {
  if (status === 'approved') return 'bg-charcoal/8 text-charcoal-soft'
  if (status === 'rejected') return 'bg-stone-light text-stone'
  return 'border border-gold-muted/60 text-gold'
}

function AdminImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="w-full rounded-sm bg-stone-light/60 text-stone text-xs py-6 text-center mb-4">
        Photo unavailable
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full max-h-56 object-cover rounded-sm mb-4"
      onError={() => setFailed(true)}
    />
  )
}

export function AdminPage() {
  const [session, setSession] = useState<{ email?: string } | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  const [tab, setTab] = useState<AdminTab>('pending')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [busyAction, setBusyAction] = useState<ActionType | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const checkAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    return data?.role === 'admin'
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false)
      return
    }

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (s?.user) {
        setSession({ email: s.user.email })
        const admin = await checkAdmin(s.user.id)
        setIsAdmin(admin)
      }
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        if (s?.user) {
          setSession({ email: s.user.email })
          const admin = await checkAdmin(s.user.id)
          setIsAdmin(admin)
        } else {
          setSession(null)
          setIsAdmin(false)
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [checkAdmin])

  const loadExperiences = useCallback(async () => {
    setLoading(true)
    setActionError(null)
    try {
      const data =
        tab === 'pending'
          ? await fetchPendingExperiences()
          : await fetchAllExperiencesForAdmin()
      setExperiences(data)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to load experiences.')
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    if (isAdmin) loadExperiences()
  }, [isAdmin, loadExperiences])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const runAction = async (id: string, action: ActionType, fn: () => Promise<void>, successMsg: string) => {
    if (busyId) return
    setBusyId(id)
    setBusyAction(action)
    setActionSuccess(null)
    setActionError(null)
    try {
      await fn()
      setActionSuccess(successMsg)
      await loadExperiences()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed.')
    } finally {
      setBusyId(null)
      setBusyAction(null)
    }
  }

  const handleApprove = (id: string) =>
    runAction(id, 'approve', () => updateExperienceStatus(id, 'approved'), 'Experience approved — it will appear on the public map.')

  const handleReject = (id: string) =>
    runAction(id, 'reject', () => updateExperienceStatus(id, 'rejected'), 'Experience rejected.')

  const handleDelete = (id: string) => {
    if (!confirm('Delete this experience permanently?')) return
    runAction(id, 'delete', () => deleteExperience(id), 'Experience deleted.')
  }

  if (checking) {
    return (
      <AdminCentered>
        <LoadingSpinner message="Loading…" />
      </AdminCentered>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <AdminCentered>
        <p className="text-stone">Supabase is not configured.</p>
      </AdminCentered>
    )
  }

  if (!session) {
    return (
      <AdminCentered>
        <div className="glass-strong rounded-sm p-6 sm:p-8 max-w-md w-full border border-stone-light/50">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-charcoal mb-6 transition-colors">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to map
          </Link>
          <h1 className="font-display text-2xl font-medium text-charcoal mb-2">Admin</h1>
          <p className="text-sm text-stone mb-6">Sign in to moderate shared memories.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
              className={inputClass}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
            {authError && (
              <p className="text-sm text-charcoal-soft bg-stone-light/50 rounded-sm px-4 py-3">{authError}</p>
            )}
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </AdminCentered>
    )
  }

  if (!isAdmin) {
    return (
      <AdminCentered>
        <div className="glass-strong rounded-sm p-6 sm:p-8 max-w-md w-full text-center border border-stone-light/50">
          <p className="text-charcoal-soft mb-4">Access denied. Admin role required.</p>
          <p className="text-xs text-stone mb-6">
            Set role to &apos;admin&apos; in the profiles table for your user.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="secondary" onClick={handleLogout}>Sign out</Button>
            <Link to="/"><Button variant="ghost">Back to map</Button></Link>
          </div>
        </div>
      </AdminCentered>
    )
  }

  return (
    <AdminShell>
      <header className="glass-strong border-b border-stone-light/60 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-medium text-charcoal">Moderation</h1>
              <p className="text-xs text-stone truncate">{session.email}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to="/" className="flex-1 sm:flex-none">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">Map</Button>
              </Link>
              <Button variant="secondary" size="sm" className="flex-1 sm:flex-none" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6 pb-10 safe-bottom">
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <Button
            size="sm"
            variant={tab === 'pending' ? 'primary' : 'secondary'}
            onClick={() => setTab('pending')}
          >
            Pending{tab === 'pending' && !loading ? ` (${experiences.length})` : ''}
          </Button>
          <Button
            size="sm"
            variant={tab === 'all' ? 'primary' : 'secondary'}
            onClick={() => setTab('all')}
          >
            All experiences
          </Button>
          <Button size="sm" variant="ghost" onClick={loadExperiences} disabled={loading}>
            Refresh
          </Button>
        </div>

        {actionError && (
          <p className="text-sm text-charcoal-soft mb-4 bg-stone-light/50 rounded-sm px-4 py-3">{actionError}</p>
        )}
        {actionSuccess && (
          <p className="text-sm text-charcoal-soft mb-4 bg-gold/10 rounded-sm px-4 py-3 border border-gold-muted/30">{actionSuccess}</p>
        )}

        {loading ? (
          <LoadingSpinner message="Loading experiences…" />
        ) : experiences.length === 0 ? (
          <EmptyState
            title={tab === 'pending' ? 'All caught up' : 'No experiences yet'}
            message={
              tab === 'pending'
                ? 'No experiences waiting for approval.'
                : 'No experiences in the database.'
            }
          />
        ) : (
          <ul className="space-y-4 pb-4">
            {experiences.map((exp) => {
              const cat = getCategory(exp.category)
              const isExpanded = expandedId === exp.id
              const isBusy = busyId === exp.id

              return (
                <li key={exp.id} className="glass-strong rounded-sm p-4 sm:p-5 border border-stone-light/50">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryChip categoryId={cat.id} label={cat.label} size="sm" />
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClass(exp.status)}`}>
                        {exp.status}
                      </span>
                      {exp.image_url && (
                        <span className="inline-flex items-center gap-1 text-xs text-stone">
                          <Camera size={12} strokeWidth={1.5} />
                          Photo
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone shrink-0">{formatDate(exp.created_at)}</span>
                  </div>

                  {exp.location_name && (
                    <p className="flex items-center gap-1.5 text-xs text-stone mb-2 break-words">
                      <MapPin size={12} strokeWidth={1.5} className="text-gold shrink-0" />
                      {exp.location_name}
                    </p>
                  )}

                  <h3 className="font-display text-lg font-medium text-charcoal mb-2 break-words">{exp.title}</h3>

                  <p className="text-sm text-charcoal-soft mb-2 whitespace-pre-wrap break-words leading-relaxed">
                    {isExpanded ? exp.story : truncateText(exp.story, 200)}
                  </p>
                  {exp.story.length > 200 && (
                    <button
                      type="button"
                      className="text-xs text-stone hover:text-charcoal mb-3 underline underline-offset-2 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    >
                      {isExpanded ? 'Show less' : 'Read full story'}
                    </button>
                  )}

                  <p className="text-xs text-stone mb-4 break-all">
                    {getAuthorDisplay(exp)} · {exp.lat.toFixed(4)}, {exp.lng.toFixed(4)}
                  </p>

                  {exp.image_url && (
                    <AdminImage src={exp.image_url} alt={exp.title} />
                  )}

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                    {exp.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="w-full sm:w-auto"
                          disabled={isBusy}
                          onClick={() => handleApprove(exp.id)}
                        >
                          {isBusy && busyAction === 'approve' ? 'Approving…' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full sm:w-auto"
                          disabled={isBusy}
                          onClick={() => handleReject(exp.id)}
                        >
                          {isBusy && busyAction === 'reject' ? 'Rejecting…' : 'Reject'}
                        </Button>
                      </>
                    )}
                    {exp.status === 'rejected' && (
                      <Button
                        size="sm"
                        className="w-full sm:w-auto"
                        disabled={isBusy}
                        onClick={() => handleApprove(exp.id)}
                      >
                        {isBusy && busyAction === 'approve' ? 'Approving…' : 'Approve'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      className="w-full sm:w-auto"
                      disabled={isBusy}
                      onClick={() => handleDelete(exp.id)}
                    >
                      {isBusy && busyAction === 'delete' ? 'Deleting…' : 'Delete'}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </AdminShell>
  )
}
