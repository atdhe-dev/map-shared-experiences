import type { ReactNode } from 'react'

/** Full-viewport scroll shell — escapes map app overflow:hidden on #root */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell fixed inset-0 z-[5000] overflow-y-auto overscroll-y-contain bg-cream">
      {children}
    </div>
  )
}

export function AdminCentered({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      <div className="min-h-full flex items-center justify-center p-4 pb-8 safe-bottom">
        {children}
      </div>
    </AdminShell>
  )
}
