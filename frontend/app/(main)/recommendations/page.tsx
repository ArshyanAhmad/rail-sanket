'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  TrainFront,
  ArrowRight,
  ShieldCheck,
  Check,
  Building2,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recommendedBlocks } from '@/lib/data/recommendations'
import { corridorName } from '@/lib/data/corridors'

interface RecommendationItem {
  id: string
  corridorId: string
  corridorCode: string
  window: string
  duration: string
  tasksCount: number
  utilization: string
  priorityScore: number
  reasons: string[]
  taskSummary: string[]
}

const smartRecommendations: RecommendationItem[] = [
  {
    id: 'REC-01',
    corridorId: 'C03',
    corridorCode: 'KGP–TATA',
    window: '10:00 – 12:00',
    duration: '2h (120 min)',
    tasksCount: 4,
    utilization: '83%',
    priorityScore: 92,
    reasons: [
      'High priority maintenance tasks scheduled first',
      'All 4 tasks are located on the same corridor section',
      'Fits cleanly into available window without train detention',
      'No interlocking or power-block dependencies conflict',
    ],
    taskSummary: ['ENG-221 (Track)', 'SNT-221 (Signal)', 'TD-101 (OHE)', 'ENG-268 (Alignment)'],
  },
  {
    id: 'REC-02',
    corridorId: 'C02',
    corridorCode: 'KGP–BLS',
    window: '14:00 – 16:00',
    duration: '2h (120 min)',
    tasksCount: 3,
    utilization: '78%',
    priorityScore: 88,
    reasons: [
      'High priority contact wire replacement included',
      'Bundled track welding and insulator inspection',
      'Fits afternoon traffic gap between express paths',
      'Pre-cleared with Kharagpur Traction Power Controller',
    ],
    taskSummary: ['TD-149 (OHE Wire)', 'ENG-247 (Weld Check)', 'TD-182 (Insulators)'],
  },
  {
    id: 'REC-03',
    corridorId: 'C01',
    corridorCode: 'HWH–KGP',
    window: '11:30 – 13:00',
    duration: '1.5h (90 min)',
    tasksCount: 3,
    utilization: '85%',
    priorityScore: 84,
    reasons: [
      'Critical point machine repair at Howrah Yard line 7',
      'Turnout tamping bundled during same possession',
      'No conflict with suburban local train schedules',
      'S&T Gang B ready on site',
    ],
    taskSummary: ['SNT-193 (Point Machine)', 'ENG-259 (Turnout)', 'TD-166 (TSS Bay)'],
  },
  {
    id: 'REC-04',
    corridorId: 'C04',
    corridorCode: 'KGP–ADRA',
    window: '09:00 – 11:00',
    duration: '2h (120 min)',
    tasksCount: 2,
    utilization: '72%',
    priorityScore: 79,
    reasons: [
      'Resolves pending track circuit failure at BBS–KUR section',
      'Power block synchronized with OHE inspection team',
      'Fits morning freight window',
    ],
    taskSummary: ['SNT-214 (Track Circuit)', 'TD-158 (OHE Check)'],
  },
]

export default function RecommendationsPage() {
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'rejected'>>({})

  const handleApprove = (id: string, code: string) => {
    setDecisions((prev) => ({ ...prev, [id]: 'approved' }))
    toast.success(`Recommendation ${id} Approved`, {
      description: `Block plan for ${code} added to active weekly plan.`,
    })
  }

  const handleReject = (id: string) => {
    setDecisions((prev) => ({ ...prev, [id]: 'rejected' }))
    toast.info(`Recommendation ${id} Deferred`, {
      description: 'Returned to queue for next scheduling cycle.',
    })
  }

  const approvedCount = Object.values(decisions).filter((v) => v === 'approved').length

  return (
    <div className="space-y-6">
      <PageHeader
        badge="SOUTH EASTERN RAILWAY · KHARAGPUR DIVISION"
        title="Smart Recommendations"
        description="Explainable decision-support block recommendations. Review bundled tasks, corridor windows, and approve plans for the weekly schedule."
      >
        <Button
          onClick={() => {
            smartRecommendations.forEach((r) => {
              if (!decisions[r.id]) {
                setDecisions((prev) => ({ ...prev, [r.id]: 'approved' }))
              }
            })
            toast.success('All Pending Recommendations Approved', {
              description: 'Weekly block schedule updated and finalized.',
            })
          }}
          className="text-xs gap-1.5"
        >
          <CheckCircle2 className="size-3.5" />
          Approve All Pending
        </Button>
      </PageHeader>

      {/* Summary KPI Strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Recommended Blocks</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900">{smartRecommendations.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Across 4 corridors</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Approved by Planner</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-700">{approvedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{smartRecommendations.length - approvedCount} pending review</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Total Tasks Bundled</p>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">12</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">3 departments coordinated</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Avg. Window Utilization</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900">81.5%</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">375 min downtime saved</p>
        </Card>
      </section>

      {/* Recommendation Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {smartRecommendations.map((rec) => {
          const status = decisions[rec.id]
          return (
            <Card
              key={rec.id}
              className={`border-2 transition-all shadow-xs ${
                status === 'approved'
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : status === 'rejected'
                  ? 'border-slate-200 bg-slate-50/40 opacity-70'
                  : 'border-border bg-white'
              }`}
            >
              <CardHeader className="border-b border-border/80 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{rec.id}</span>
                    <span className="text-base font-bold text-slate-900">
                      Recommended Block
                    </span>
                  </div>
                  {status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                      <Check className="size-3" /> Approved
                    </span>
                  ) : status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      Deferred
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-primary border border-blue-200">
                      Priority: {rec.priorityScore}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* Metrics Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg border border-border bg-slate-50/80">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Corridor</span>
                    <strong className="text-slate-900">{rec.corridorCode}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Window</span>
                    <strong className="text-slate-900">{rec.window}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Tasks</span>
                    <strong className="text-slate-900">{rec.tasksCount} tasks</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Utilization</span>
                    <strong className="text-emerald-700">{rec.utilization}</strong>
                  </div>
                </div>

                {/* Bundled Tasks */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Bundled Maintenance Tasks:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.taskSummary.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-700 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why? Section */}
                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 text-xs block">Why recommended?</span>
                  <ul className="space-y-1 text-slate-700 leading-relaxed">
                    {rec.reasons.map((r) => (
                      <li key={r} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {status !== 'approved' ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(rec.id, rec.corridorCode)}
                        className="flex-1 text-xs gap-1.5 font-semibold"
                      >
                        <Check className="size-3.5" />
                        Approve Plan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(rec.id)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Defer
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href="/planner">
                          Review in Planner
                          <ArrowRight className="size-3.5 ml-1" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="size-4" /> Ready for weekly block dispatch
                      </span>
                      <Button size="xs" variant="ghost" asChild>
                        <Link href="/planner">Inspect</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
