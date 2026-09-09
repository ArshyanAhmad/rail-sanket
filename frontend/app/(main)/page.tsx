import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CalendarClock,
  TriangleAlert,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  FileCheck2,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvailabilityChart } from '@/components/charts/availability-chart'
import { tasks } from '@/lib/data/tasks'
import { recommendedBlocks } from '@/lib/data/recommendations'
import { conflicts, exceptions } from '@/lib/data/conflicts'
import { corridorName, corridorMap } from '@/lib/data/corridors'
import {
  confidenceTone,
  severityTone,
  impactTone,
} from '@/lib/status'

// 6 focused KPI cards requested in Phase 5
const dashboardKpis = [
  { id: 'pending', label: 'Pending Tasks', value: '85', tone: 'text-foreground', note: 'Across 5 corridors' },
  { id: 'critical', label: 'Critical Tasks', value: '12', tone: 'text-danger', note: 'Needs immediate block' },
  { id: 'avail-hours', label: 'Available Block Hours', value: '18.5 h', tone: 'text-foreground', note: 'Approved line capacity' },
  { id: 'planned-hours', label: 'Planned Block Hours', value: '16.2 h', tone: 'text-primary', note: 'Scheduled this week' },
  { id: 'availability', label: 'Asset Availability', value: '96.8%', tone: 'text-success', note: '↑ 1.4% from last week' },
  { id: 'conflicts', label: 'Conflicts', value: '6', tone: 'text-warning', note: 'Needs traffic resolution' },
]

export default function DashboardPage() {
  const priorityTasks = tasks
    .filter((t) => t.status === 'Open' || t.status === 'Scheduled')
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6)

  const openConflicts = conflicts.filter((c) => !c.resolved)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-white shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 items-center">
          <div className="p-5 md:p-6 md:col-span-2 lg:col-span-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <ShieldCheck className="size-3 text-primary" />
                KHARAGPUR DIVISION · SER
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="size-3 text-emerald-600" />
                This week&apos;s maintenance planning overview
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-10 w-48 shrink-0">
                <Image
                  src="/images/rail-sanket-logo.png"
                  alt="Rail Sanket"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Operations &amp; Block Planning
              </h1>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Coordinating Engineering (TMS), S&amp;T (SMMS), and Traction (TDMS) maintenance block windows. Bundling tasks to minimize traffic possessions and eliminate train delays.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Button size="sm" asChild>
                <Link href="/planner">
                  <CalendarClock className="size-3.5" />
                  Block Planner
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/recommendations">
                  Smart Recommendations
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/queue">
                  Maintenance Queue (85)
                </Link>
              </Button>
            </div>
          </div>

          {/* Locomotive Image Frame */}
          <div className="relative h-44 md:h-full min-h-[170px] w-full border-t md:border-t-0 md:border-l border-border bg-slate-100 overflow-hidden">
            <Image
              src="/images/train-photo.jpg"
              alt="Indian Railways Locomotive"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:to-black/30" />
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <span className="text-[10px] font-medium tracking-wide uppercase text-slate-200 block">
                Indian Railways
              </span>
              <span className="text-xs font-bold leading-tight drop-shadow-sm block">
                WAP-4 · Kharagpur Operations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {dashboardKpis.map((k) => (
          <Card key={k.id} className="p-4">
            <p className="text-xs text-muted-foreground font-medium">{k.label}</p>
            <p className={`mt-2 font-mono text-2xl font-bold tabular-nums ${k.tone}`}>{k.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{k.note}</p>
          </Card>
        ))}
      </section>

      {/* SECTION 1: Weekly Maintenance Overview */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Weekly Maintenance Overview</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Available Block Hours vs. Planned Block Hours across corridors (past 7 days)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-chart-1" /> Available Block Hours
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-chart-2" /> Planned Block Hours
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <AvailabilityChart />
        </CardContent>
      </Card>

      {/* SECTION 2: Recommended Blocks */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recommended Blocks</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Optimized corridor block windows ready for planner review
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/recommendations">
              View All Recommendations
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Date</th>
                  <th className="px-3.5 py-2.5">Corridor</th>
                  <th className="px-3.5 py-2.5">Time</th>
                  <th className="px-3.5 py-2.5">Duration</th>
                  <th className="px-3.5 py-2.5">Tasks</th>
                  <th className="px-3.5 py-2.5">Utilization</th>
                  <th className="px-3.5 py-2.5">Reason</th>
                  <th className="px-3.5 py-2.5">Status</th>
                  <th className="px-3.5 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {recommendedBlocks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-3 font-mono font-medium text-slate-800 whitespace-nowrap">
                      {b.date}
                    </td>
                    <td className="px-3.5 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {corridorName(b.corridorId)}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {b.start}–{b.end}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {Math.floor(b.durationMin / 60)}h {b.durationMin % 60 ? `${b.durationMin % 60}m` : ''}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-700 whitespace-nowrap">
                      {b.taskIds.length} tasks
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        83%
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 max-w-[220px] truncate" title={b.section}>
                      Good maintenance window · {b.taskIds.length} tasks bundled
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <CheckCircle2 className="size-3" />
                        Recommended
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right whitespace-nowrap">
                      <Button size="xs" variant="outline" asChild>
                        <Link href="/planner">Inspect</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Priority Maintenance Tasks */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Priority Maintenance Tasks</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Highest urgency maintenance items requiring block allocation
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/queue">
              Open Maintenance Queue
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Priority</th>
                  <th className="px-3.5 py-2.5">Task ID</th>
                  <th className="px-3.5 py-2.5">Task</th>
                  <th className="px-3.5 py-2.5">Department</th>
                  <th className="px-3.5 py-2.5">Corridor</th>
                  <th className="px-3.5 py-2.5">Due Date</th>
                  <th className="px-3.5 py-2.5 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {priorityTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                          t.criticality === 'Critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : t.criticality === 'High'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {t.criticality}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {t.id}
                    </td>
                    <td className="px-3.5 py-3 font-medium text-slate-800">
                      {t.taskType}
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 whitespace-nowrap">
                      {t.department}
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 whitespace-nowrap">
                      {corridorName(t.corridorId)}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {t.dueDate}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-right text-slate-600 whitespace-nowrap">
                      {t.estimatedDuration} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: Planning Alerts */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Planning Alerts</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Critical issues, conflicts, and overdue maintenance requiring attention
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/conflicts">
              Review Conflicts
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {/* Alert 1: Critical Task Not Scheduled */}
            <div className="rounded-lg border border-red-200 bg-red-50/60 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-red-700 font-semibold text-xs mb-1.5">
                  <AlertCircle className="size-4 shrink-0 text-red-600" />
                  <span>Critical Task Not Scheduled</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {exceptions[0]?.taskId || 'ENG-221'} — {exceptions[0]?.reason || 'No feasible window found in C01 corridor.'}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-red-200/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-red-600 font-semibold">Priority: Immediate</span>
                <Button size="xs" variant="outline" className="h-6 text-[11px] bg-white border-red-200 hover:bg-red-50 text-red-700" asChild>
                  <Link href="/planner">Find Window</Link>
                </Button>
              </div>
            </div>

            {/* Alert 2: Block Conflict */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs mb-1.5">
                  <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                  <span>Block Conflict Detected</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {openConflicts[0]?.title || 'Two maintenance plans overlap with Coromandel Express schedule on C01.'}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-700 font-semibold">Corridor: C01</span>
                <Button size="xs" variant="outline" className="h-6 text-[11px] bg-white border-amber-200 hover:bg-amber-50 text-amber-800" asChild>
                  <Link href="/conflicts">Resolve</Link>
                </Button>
              </div>
            </div>

            {/* Alert 3: Overdue Maintenance */}
            <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs mb-1.5">
                  <Clock className="size-4 shrink-0 text-blue-600" />
                  <span>Overdue Maintenance</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Track welding and point machine check on C03 are 4 days overdue safety inspection window.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-blue-700 font-semibold">Asset: PWay Gang 5</span>
                <Button size="xs" variant="outline" className="h-6 text-[11px] bg-white border-blue-200 hover:bg-blue-50 text-blue-800" asChild>
                  <Link href="/queue">View Queue</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
