'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  TrainFront,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  LogOut,
  CheckCircle2,
  Building2,
  ArrowLeft,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth, defaultOfficers, type UserSession } from '@/lib/auth-context'

function AuthCard() {
  const router = useRouter()
  const { user, isAuthenticated, login, logout } = useAuth()

  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(defaultOfficers[0].id)
  const [email, setEmail] = useState<string>(defaultOfficers[0].email)
  const [password, setPassword] = useState<string>('ser•planner•2026')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // When dropdown changes, update email field
  const handleSelectChange = (officerId: string) => {
    setSelectedOfficerId(officerId)
    const officer = defaultOfficers.find((o) => o.id === officerId)
    if (officer) {
      setEmail(officer.email)
      setErrorMsg('')
    }
  }

  // 1-Click Demo Login
  const handleContinueDemoOfficer = () => {
    const target = defaultOfficers.find((o) => o.id === selectedOfficerId) || defaultOfficers[0]
    setIsProcessing(true)
    setTimeout(() => {
      login(target, '/dashboard')
      setIsProcessing(false)
    }, 200)
  }

  // Standard Email/Password Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    const trimmedEmail = email.trim()
    const trimmedPass = password.trim()

    if (!trimmedEmail || !trimmedPass) {
      setErrorMsg('Please enter both official email and password.')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const matched = defaultOfficers.find(
        (acc) => acc.email.toLowerCase() === trimmedEmail.toLowerCase()
      )

      if (!matched && !trimmedEmail.includes('@')) {
        setIsProcessing(false)
        setErrorMsg('Invalid officer credentials.')
        return
      }

      const officerToLogin = matched || {
        id: 'officer-custom',
        name: trimmedEmail.split('@')[0].toUpperCase(),
        cadre: 'IRTS',
        designation: 'Duty Block Planner',
        department: 'Operating Control',
        email: trimmedEmail,
        division: 'Kharagpur Division, SER',
        initials: 'IR',
        loginTime: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      }

      login(officerToLogin, '/dashboard')
      setIsProcessing(false)
    }, 300)
  }

  // SECTION 5: IF USER IS ALREADY LOGGED IN
  if (isAuthenticated && user) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">You&apos;re already signed in.</h2>
            <p className="text-xs text-slate-500">Active session detected</p>
          </div>
        </div>

        {/* Current Officer Details */}
        <div className="my-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current Officer
          </div>
          <div className="text-base font-bold text-slate-900">
            {user.name}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            {user.designation || 'Divisional Traffic Controller'}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-primary">{user.cadre}</span>
            <span>&middot;</span>
            <span>{user.department || 'Operating'}</span>
          </div>
          <div className="pt-1 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Building2 className="size-3" />
            <span>{user.division || 'Kharagpur Division, SER'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Button asChild className="w-full gap-2 bg-primary hover:bg-primary/95 text-white font-semibold h-10 shadow-xs cursor-pointer">
            <Link href="/dashboard">
              <span>Open Dashboard</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={logout}
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-red-50 border-slate-200 h-10 cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    )
  }

  // SECTION 6: CLEAN & FOCUSED LOGIN CARD
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
      
      {/* Card Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Officer Login
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your official credentials or select a demo officer.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="officer@ser.railnet.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 text-xs h-9 bg-white border-slate-200 focus:border-primary"
              disabled={isProcessing}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 text-xs h-9 bg-white border-slate-200 focus:border-primary"
              disabled={isProcessing}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full font-semibold text-xs h-9.5 bg-primary hover:bg-primary/95 text-white shadow-xs cursor-pointer mt-1"
        >
          {isProcessing ? 'Signing In…' : 'Sign In'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative text-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
          OR
        </span>
      </div>

      {/* Demo Officer Selection */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <UserCheck className="size-4 text-primary" />
            <span>Demo Officer</span>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            1-Click Access
          </span>
        </div>

        {/* Dropdown Selector */}
        <div className="space-y-1.5">
          <label htmlFor="demo-officer-select" className="text-[11px] font-medium text-slate-600 block">
            Select Officer
          </label>
          <select
            id="demo-officer-select"
            value={selectedOfficerId}
            onChange={(e) => handleSelectChange(e.target.value)}
            disabled={isProcessing}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
          >
            {defaultOfficers.map((officer) => (
              <option key={officer.id} value={officer.id}>
                {officer.name} · {officer.cadre} ({officer.department.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Continue Button */}
        <Button
          type="button"
          onClick={handleContinueDemoOfficer}
          disabled={isProcessing}
          className="w-full text-xs h-9.5 font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer gap-2"
        >
          <span>Continue as Demo Officer</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      {/* Return to Public Website */}
      <div className="pt-2 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>

    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Title & Subtitle Header */}
      <div className="text-center mb-6 space-y-1.5">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm mb-2">
          <TrainFront className="size-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Railway Block Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          AI-Assisted Maintenance &amp; Block Planning
        </p>
      </div>

      {/* Centered Login Card */}
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading…</div>}>
        <AuthCard />
      </Suspense>

      {/* Footer Notice */}
      <div className="mt-8 text-center text-xs text-slate-400">
        SIH 2026 Prototype &middot; Kharagpur Division, South Eastern Railway
      </div>
    </div>
  )
}
