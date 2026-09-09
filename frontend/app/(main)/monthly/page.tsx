'use client'

import { useState } from 'react'
import {
  CalendarRange,
  ChevronDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { monthlyCorridorCapacity } from '@/lib/data/dashboard'
import { corridorName } from '@/lib/data/corridors'

const weeklyPlanSummaries = [
  {
    week: 'Week 1 (1–7 Sep 2026)',
    summary: 'Track deep screening on C01 (Howrah–Kharagpur) and signal interlocking check at Kharagpur Yard.',
    plannedBlocks: 4,
    hours: '14.5 h',
    status: 'Completed',
  },
  {
    week: 'Week 2 (8–14 Sep 2026)',
    summary: 'OHE insulator replacement on C02 (KGP–Bhubaneswar) and turnout tamping across 3 station yards.',
    plannedBlocks: 5,
    hours: '16.0 h',
    status: 'Completed',
  },
  {
    week: 'Week 3 (15–21 Sep 2026) — CURRENT',
    summary: 'Rail defect rectification on C03 (KGP–Tatanagar) and TSS substation maintenance at Kharagpur.',
    plannedBlocks: 5,
    hours: '16.2 h',
    status: 'Active Planning',
  },
  {
    week: 'Week 4 (22–30 Sep 2026)',
    summary: 'Bridge deck bearing inspection on C05 (KGP–Digha) and power block on Adra section.',
    plannedBlocks: 4,
    hours: '15.5 h',
    status: 'Scheduled',
  },
]

const unscheduledExceptions = [
  {
    type: 'Critical Task Not Yet Planned',
    item: 'ENG-221 (Rail Fracture Repair at KM 118, C01)',
    reason: 'Traffic density peak during suburban morning hours; no 2-hour window available without local EMU regulation.',
    action: 'Carry forward to Sunday maintenance corridor or request 90-minute night power block.',
  },
  {
    type: 'Capacity Shortage',
    item: 'Corridor C01 (Howrah – Kharagpur)',
    reason: 'Demand of 22.5 hours exceeds total available line possession capacity of 18.0 hours this month.',
    action: 'Prioritize critical track work; defer routine ballast cleaning to October cycle.',
  },
  {
    type: 'Block Conflict',
    item: 'CF-02 on Corridor C02 (Balasore Section)',
    reason: 'Overlap between scheduled freight goods train BCN/321 and planned OHE maintenance.',
    action: 'Shift maintenance block by 25 minutes after dispatch of passenger express.',
  },
]

export default function MonthlyPage() {
  const [selectedMonth, setSelectedMonth] = useState('September 2026')

  const totalDemand = monthlyCorridorCapacity.reduce((s, c) => s + c.demandHours, 0)
  const totalCapacity = monthlyCorridorCapacity.reduce((s, c) => s + c.capacityHours, 0)
  const totalCritical = monthlyCorridorCapacity.reduce((s, c) => s + c.criticalOpen, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
            SOUTH EASTERN RAILWAY · KHARAGPUR DIVISION
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Monthly Maintenance Plan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            High-level monthly maintenance demand vs. available block capacity
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
            >
              <option value="September 2026">September 2026</option>
              <option value="October 2026">October 2026</option>
              <option value="November 2026">November 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Total Tasks</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900">85</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Across all 5 corridors</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Critical Tasks</p>
          <p className="mt-1 font-mono text-2xl font-bold text-red-700">{totalCritical}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Needs priority window</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Planned Hours</p>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">{totalDemand} h</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Scheduled for September</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Available Hours</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900">{totalCapacity} h</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
            {Math.round((totalDemand / totalCapacity) * 100)}% total utilization
          </p>
        </Card>
      </section>

      {/* CORRIDOR SUMMARY */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Corridor Summary</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monthly workload and possession capacity distribution across division corridors
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Corridor</th>
                  <th className="px-3.5 py-2.5">Tasks</th>
                  <th className="px-3.5 py-2.5">Planned Hours</th>
                  <th className="px-3.5 py-2.5">Available Hours</th>
                  <th className="px-3.5 py-2.5 text-right">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {monthlyCorridorCapacity.map((c) => {
                  const util = Math.round((c.demandHours / c.capacityHours) * 100)
                  return (
                    <tr key={c.corridor} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3.5 py-3 font-semibold text-slate-900">
                        {corridorName(c.corridor)}
                      </td>
                      <td className="px-3.5 py-3 font-mono text-slate-700">
                        {c.criticalOpen + 12} tasks
                      </td>
                      <td className="px-3.5 py-3 font-mono text-primary font-bold">
                        {c.demandHours} h
                      </td>
                      <td className="px-3.5 py-3 font-mono text-slate-600">
                        {c.capacityHours} h
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                            util > 100
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : util > 85
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {util}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* WEEKLY PLAN */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Plan</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Grouped 4-week block execution schedule for September 2026
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyPlanSummaries.map((w, index) => (
              <div
                key={w.week}
                className="rounded-lg border border-border bg-slate-50/60 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{w.week}</span>
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${
                        w.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : w.status === 'Active Planning'
                          ? 'bg-blue-100 text-blue-800 font-bold'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{w.summary}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0 sm:border-l sm:border-border sm:pl-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans">Blocks</span>
                    <span className="font-bold text-slate-800">{w.plannedBlocks} blocks</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans">Time</span>
                    <span className="font-bold text-primary">{w.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UNSCHEDULED / EXCEPTIONS */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600" />
            <CardTitle className="text-base">Unscheduled / Exceptions</CardTitle>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Items requiring special block extension or departmental review
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {unscheduledExceptions.map((exc) => (
              <div
                key={exc.item}
                className="rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">{exc.type}</span>
                  <span className="font-mono text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                    Exception
                  </span>
                </div>
                <div className="font-semibold text-slate-900">{exc.item}</div>
                <p className="text-slate-700 leading-relaxed">{exc.reason}</p>
                <div className="pt-1 text-[11px] text-primary font-medium">
                  → Recommended Action: {exc.action}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
