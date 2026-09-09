'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, defaultOfficers } from '@/lib/auth-context'
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowLeftRight,
  LogOut,
  Shield,
} from 'lucide-react'
import { activeNav } from '@/lib/nav'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'

const divisions = [
  { id: 'KGP', name: 'Kharagpur Division', zone: 'South Eastern Railway', active: true },
  { id: 'HWH', name: 'Howrah Division', zone: 'Eastern Railway', active: false },
  { id: 'CKP', name: 'Chakradharpur Division', zone: 'South Eastern Railway', active: false },
  { id: 'ADRA', name: 'Adra Division', zone: 'South Eastern Railway', active: false },
]

const notificationsList = [
  { id: '1', title: 'ENG-221 flagged as exception', meta: 'No feasible window in corridor C01 · 2m ago', unread: true },
  { id: '2', title: 'Conflict CF-01 needs resolution', meta: 'Overlaps with Coromandel Exp · 14m ago', unread: true },
  { id: '3', title: 'Recommendation REC-102 generated', meta: 'Bridge bearing block on C03 · 1h ago', unread: false },
  { id: '4', title: 'Timetable feed synced', meta: 'All 5 corridors updated with latest paths · 2h ago', unread: false },
]

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const current = activeNav(pathname)
  const { user, login, logout } = useAuth()
  const [selectedDiv, setSelectedDiv] = useState(divisions[0])
  const [notifications, setNotifications] = useState(notificationsList)

  const unreadCount = notifications.filter((n) => n.unread).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    toast.success('All notifications marked as read')
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-4 md:px-6 select-none">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      {/* Page Title & Breadcrumb */}
      <div className="min-w-0 flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold text-foreground">
              {current?.label ?? 'Dashboard'}
            </h1>
            <span className="hidden rounded border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary sm:inline-flex items-center gap-1">
              <Calendar className="size-2.5" />
              Week 38 · Sep 2026
            </span>
          </div>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {selectedDiv.zone} · {selectedDiv.name}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2">
        {/* Division Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-muted lg:flex outline-none cursor-pointer">
            <Building2 className="size-3.5 text-primary" />
            <span>{selectedDiv.name}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-xs">Select Railway Division</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {divisions.map((div) => (
              <DropdownMenuItem
                key={div.id}
                onClick={() => {
                  setSelectedDiv(div)
                  toast.info(`Switched to ${div.name}`)
                }}
                className="flex items-center justify-between py-2 text-xs cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-foreground">{div.name}</div>
                  <div className="text-[10px] text-muted-foreground">{div.zone}</div>
                </div>
                {selectedDiv.id === div.id && (
                  <CheckCircle2 className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-white" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-foreground">
                Notifications ({unreadCount} new)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-1 py-2.5 px-3 cursor-pointer"
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                    )
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{n.title}</span>
                    {n.unread && (
                      <span className="size-1.5 rounded-full bg-danger" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground leading-snug">{n.meta}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 px-2.5 py-1.5 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all outline-none cursor-pointer shadow-xs">
            <div className="relative">
              <Avatar className="size-7 ring-1 ring-primary/30 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-bold">
                  {user?.initials || 'IR'}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-xs font-bold text-slate-900">{user?.name || 'Officer On-Duty'}</div>
              <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                <span className="font-bold text-primary">{user?.cadre || 'IRTS'}</span>
                <span>·</span>
                <span className="truncate max-w-[110px]">{user?.department ? user.department.split(' ')[0] : 'Operating'}</span>
              </div>
            </div>
            <ChevronDown className="size-3 text-slate-400 ml-0.5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-xl border border-slate-200/90 bg-white">
            {/* Officer Header Card */}
            <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3.5 text-white shadow-xs mb-2">
              <div className="flex items-start gap-3">
                <Avatar className="size-11 ring-2 ring-white/20 shadow-sm shrink-0">
                  <AvatarFallback className="bg-primary text-white text-sm font-bold">
                    {user?.initials || 'IR'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white text-sm truncate">
                      {user?.name || 'Officer On-Duty'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30 shrink-0">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Duty
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate mt-0.5">
                    {user?.designation || 'Divisional Planning Officer'}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold bg-primary text-white">
                      {user?.cadre || 'IRTS'}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {user?.department || 'Operating'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                <span className="flex items-center gap-1 truncate">
                  <Building2 className="size-3 text-slate-400 shrink-0" />
                  <span className="truncate">{user?.division || 'Kharagpur Division, SER'}</span>
                </span>
                <span className="font-mono text-slate-400 shrink-0">CRIS Railnet</span>
              </div>
            </div>

            {/* Quick Switch Officer Cadres */}
            <div className="px-1 py-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                <span>Switch Officer Cadre</span>
                <span className="text-[9px] text-primary font-semibold">1-Click Switch</span>
              </div>
              <div className="space-y-1">
                {defaultOfficers.map((officer) => {
                  const isActive = user?.cadre === officer.cadre
                  return (
                    <button
                      key={officer.id}
                      type="button"
                      onClick={() => {
                        login(officer, pathname)
                        toast.success(`Switched active session to ${officer.name} (${officer.cadre})`)
                      }}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/80 text-primary font-bold border border-blue-200'
                          : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`inline-flex items-center justify-center size-5 rounded text-[10px] font-bold shrink-0 ${
                          isActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {officer.initials}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate leading-tight">{officer.name}</div>
                          <div className="text-[10px] text-slate-500 truncate leading-tight">{officer.department.split(' ')[0]}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {officer.cadre}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

            {/* Bottom Actions */}
            <div className="space-y-0.5">
              <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                <Link
                  href="/auth"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer w-full"
                >
                  <ArrowLeftRight className="size-3.5 text-slate-500" />
                  <span>Go to Login &amp; Officer Hub</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer w-full"
              >
                <LogOut className="size-3.5 text-red-600" />
                <span className="font-semibold">Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
