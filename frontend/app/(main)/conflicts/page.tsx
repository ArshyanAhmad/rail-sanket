'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  TriangleAlert,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Check,
  ShieldAlert,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ConflictItem {
  id: string
  conflict: string
  date: string
  corridor: string
  issue: string
  severity: 'Critical' | 'High' | 'Medium'
  suggestedResolution: string
  resolved: boolean
}

const initialConflicts: ConflictItem[] = [
  {
    id: 'CF-01',
    conflict: 'Block Overlap',
    date: '24 Sep',
    corridor: 'KGP–TATA',
    issue: 'Two maintenance plans (Track tamping & OHE check) use the same 10:00–12:00 window',
    severity: 'High',
    suggestedResolution: 'Bundle both tasks into a joint coordinated block possession.',
    resolved: false,
  },
  {
    id: 'CF-02',
    conflict: 'Train Path Conflict',
    date: '24 Sep',
    corridor: 'HWH–KGP',
    issue: 'Proposed 11:30 block overlaps with 12841 Coromandel Express schedule',
    severity: 'Critical',
    suggestedResolution: 'Shift maintenance block start by 25 minutes to 11:55 AM after passage of 12841.',
    resolved: false,
  },
  {
    id: 'CF-03',
    conflict: 'Resource Clash',
    date: '25 Sep',
    corridor: 'KGP–BLS',
    issue: 'S&T Gang A is allocated simultaneously to Signal testing and Point machine repair',
    severity: 'Medium',
    suggestedResolution: 'Assign Point machine repair to S&T Gang B on duty at Balasore.',
    resolved: false,
  },
  {
    id: 'CF-04',
    conflict: 'Power Block Disconnection',
    date: '26 Sep',
    corridor: 'KGP–ADRA',
    issue: 'Civil Engineering bridge inspection requires 25kV OHE power de-energization without prior TRD notice',
    severity: 'High',
    suggestedResolution: 'Link TRD-101 power block clearance alongside civil engineering possession.',
    resolved: false,
  },
  {
    id: 'CF-05',
    conflict: 'Single Line Capacity',
    date: '27 Sep',
    corridor: 'KGP–DGHA',
    issue: 'Single-line section possession would hold up EMU local 68689 for 45 minutes',
    severity: 'Medium',
    suggestedResolution: 'Reschedule block window to non-peak interval 13:15–14:45.',
    resolved: false,
  },
]

export default function ConflictsPage() {
  const [conflictList, setConflictList] = useState<ConflictItem[]>(initialConflicts)
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null)

  const handleResolve = (item: ConflictItem) => {
    setConflictList((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, resolved: true } : c))
    )
    setSelectedConflict(null)
    toast.success(`Conflict ${item.id} Resolved`, {
      description: item.suggestedResolution,
    })
  }

  const openCount = conflictList.filter((c) => !c.resolved).length
  const criticalCount = conflictList.filter((c) => !c.resolved && c.severity === 'Critical').length
  const resolvedCount = conflictList.filter((c) => c.resolved).length

  return (
    <div className="space-y-6">
      <PageHeader
        badge="SOUTH EASTERN RAILWAY · KHARAGPUR DIVISION"
        title="Planning Conflicts"
        description="Active maintenance block overlaps and corridor constraint exceptions. Review issues and apply window resolutions."
      >
        <Button
          onClick={() => {
            setConflictList((prev) => prev.map((c) => ({ ...c, resolved: true })))
            toast.success('All Conflicts Resolved', {
              description: 'Applied recommended window adjustments across all corridors.',
            })
          }}
          disabled={openCount === 0}
          className="text-xs gap-1.5"
        >
          <CheckCircle2 className="size-3.5" />
          Resolve All
        </Button>
      </PageHeader>

      {/* Summary KPI Strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Open Conflicts</p>
          <p className={`mt-1 font-mono text-2xl font-bold tabular-nums ${openCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {openCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Requiring attention</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Critical Severity</p>
          <p className="mt-1 font-mono text-2xl font-bold text-red-700 tabular-nums">{criticalCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Train path impact</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Resolved Conflicts</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums">{resolvedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Schedule updated</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Resolution Rate</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {Math.round((resolvedCount / conflictList.length) * 100)}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Of active corridor issues</p>
        </Card>
      </section>

      {/* Main Conflicts Table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base">Active Planning Conflicts</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Corridor window collisions and departmental coordination flags
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Conflict</th>
                  <th className="px-3.5 py-2.5">Date</th>
                  <th className="px-3.5 py-2.5">Corridor</th>
                  <th className="px-3.5 py-2.5">Issue</th>
                  <th className="px-3.5 py-2.5">Severity</th>
                  <th className="px-3.5 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {conflictList.map((c) => (
                  <tr
                    key={c.id}
                    className={`transition-colors ${
                      c.resolved ? 'bg-slate-50/50 opacity-60' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-3.5 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                        <span>{c.conflict}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-700 whitespace-nowrap font-medium">
                      {c.date}
                    </td>
                    <td className="px-3.5 py-3 font-medium text-slate-800 whitespace-nowrap">
                      {c.corridor}
                    </td>
                    <td className="px-3.5 py-3 text-slate-700 max-w-md">
                      <p className="leading-snug">{c.issue}</p>
                      {c.resolved && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          ✓ Resolved: {c.suggestedResolution}
                        </p>
                      )}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                          c.severity === 'Critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : c.severity === 'High'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right whitespace-nowrap">
                      {!c.resolved ? (
                        <Button
                          size="xs"
                          onClick={() => setSelectedConflict(c)}
                          className="h-7 text-xs font-semibold px-3 bg-primary hover:bg-primary/90"
                        >
                          Resolve
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <Check className="size-3" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Dialog */}
      {selectedConflict && (
        <Dialog open={!!selectedConflict} onOpenChange={(open) => !open && setSelectedConflict(null)}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TriangleAlert className="size-4 text-amber-600" />
                Resolve Conflict: {selectedConflict.conflict}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedConflict.id} · {selectedConflict.corridor} · {selectedConflict.date}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="rounded-lg border border-red-200 bg-red-50/60 p-3">
                <span className="font-semibold text-red-900 block mb-1">Identified Issue:</span>
                <p className="text-slate-700 leading-relaxed">{selectedConflict.issue}</p>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                <span className="font-semibold text-emerald-900 block mb-1">Suggested Resolution:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedConflict.suggestedResolution}</p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" onClick={() => setSelectedConflict(null)} className="text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleResolve(selectedConflict)} className="text-xs gap-1.5 font-semibold">
                <Check className="size-3.5" />
                Apply Resolution
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
