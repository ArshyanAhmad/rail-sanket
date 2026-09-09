'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  TrainFront,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  LogOut,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth, defaultOfficers, type UserSession } from '@/lib/auth-context'

interface DemoAccount {
  roleTitle: string
  officer: UserSession
  demoPassword: string
}

const demoAccounts: DemoAccount[] = [
  {
    roleTitle: 'Operations Planner',
    officer: defaultOfficers.find((o) => o.id === 'dom') || defaultOfficers[0],
    demoPassword: 'irts•dom•2026',
  },
  {
    roleTitle: 'Engineering Planner',
    officer: defaultOfficers.find((o) => o.id === 'den') || defaultOfficers[1],
    demoPassword: 'irse•den•2026',
  },
  {
    roleTitle: 'S&T Planner',
    officer: defaultOfficers.find((o) => o.id === 'dste') || defaultOfficers[3],
    demoPassword: 'irsse•s&t•2026',
  },
  {
    roleTitle: 'Traction Planner',
    officer: defaultOfficers.find((o) => o.id === 'dee') || defaultOfficers[2],
    demoPassword: 'irsee•trd•2026',
  },
]

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams?.get('redirect')
  const redirectTarget =
    !rawRedirect || rawRedirect === '/' || rawRedirect === '/auth'
      ? '/dashboard'
      : rawRedirect
  const { user, isAuthenticated, login, logout } = useAuth()

  const [selectedDemoKey, setSelectedDemoKey] = useState<string>('Operations Planner')
  const [email, setEmail] = useState<string>(demoAccounts[0].officer.email)
  const [password, setPassword] = useState<string>(demoAccounts[0].demoPassword)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handleSelectDemoAccount = (roleKey: string) => {
    setSelectedDemoKey(roleKey)
    const target = demoAccounts.find((d) => d.roleTitle === roleKey)
    if (target) {
      setEmail(target.officer.email)
      setPassword(target.demoPassword)
      setErrorMsg('')
    }
  }

  // Continue as Demo Officer immediately authenticates that user
  const handleContinueDemoOfficer = () => {
    const target = demoAccounts.find((d) => d.roleTitle === selectedDemoKey) || demoAccounts[0]
    setIsProcessing(true)
    setTimeout(() => {
      login(target.officer, redirectTarget)
      setIsProcessing(false)
    }, 250)
  }

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
      const matched = demoAccounts.find(
        (acc) => acc.officer.email.toLowerCase() === trimmedEmail.toLowerCase()
      )

      if (!matched && !trimmedEmail.includes('@')) {
        setIsProcessing(false)
        setErrorMsg('Invalid officer credentials.')
        return
      }

      const officerToLogin = matched ? matched.officer : {
        id: 'officer-custom',
        name: trimmedEmail.split('@')[0].toUpperCase(),
        cadre: 'IRTS',
        designation: 'Duty Block Planner',
        department: 'Operating',
        email: trimmedEmail,
        division: 'Kharagpur Division, SER',
        initials: 'IR',
        loginTime: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      }

      login(officerToLogin, redirectTarget)
      setIsProcessing(false)
    }, 350)
  }

  // If already authenticated, show clean state
  if (isAuthenticated && user) {
    return (
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">You're already signed in.</h2>
            <p className="text-xs text-muted-foreground">{user.name} · {user.cadre}</p>
          </div>
        </div>

        <div className="my-6 rounded-lg border border-border bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Officer Profile</p>
          <p className="mt-1 text-base font-bold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-600 mt-0.5">
            {user.designation || 'Divisional Traffic Controller'}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Building2 className="size-3 text-slate-400" />
            <span>{user.division || 'Kharagpur Division, SER'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button asChild className="w-full gap-2">
            <Link href="/dashboard">
              Open Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-red-50"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
      {/* Mobile Branding Header */}
      <div className="mb-6 lg:hidden">
        <div className="relative h-10 w-44 mb-1.5">
          <Image
            src="/images/rail-sanket-logo.png"
            alt="Rail Sanket"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Automatic Block Planning &amp; Maintenance Bundling
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Officer Login
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Sign in to access division maintenance block scheduling.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
            Official Email / Railnet ID
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
          className="w-full font-semibold text-xs h-9 mt-1 bg-primary hover:bg-primary/90 text-white shadow-xs"
          disabled={isProcessing}
        >
          {isProcessing ? 'Authenticating…' : 'Sign In'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-5 text-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
          OR QUICK ACCESS
        </span>
      </div>

      {/* Demo Officer Quick Selector */}
      <div className="space-y-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800">Select Demo Officer</span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
            SIH Demo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {demoAccounts.map((acc) => {
            const isSelected = selectedDemoKey === acc.roleTitle
            return (
              <button
                key={acc.roleTitle}
                type="button"
                onClick={() => handleSelectDemoAccount(acc.roleTitle)}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-900">{acc.officer.cadre}</span>
                  <span className="text-[9px] font-semibold text-slate-500 truncate">{acc.roleTitle.split(' ')[0]}</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-800 truncate w-full mt-0.5">
                  {acc.officer.name}
                </div>
              </button>
            )
          })}
        </div>

        <Button
          type="button"
          onClick={handleContinueDemoOfficer}
          disabled={isProcessing}
          className="w-full text-xs h-8.5 font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
        >
          {isProcessing ? 'Launching…' : `Continue as ${demoAccounts.find((d) => d.roleTitle === selectedDemoKey)?.officer.name.split(' ')[0]} (${demoAccounts.find((d) => d.roleTitle === selectedDemoKey)?.officer.cadre})`}
        </Button>
      </div>

      {/* Footer disclaimer */}
      <div className="mt-4 text-center text-[10px] text-slate-400">
        Indian Railways · South Eastern Railway · Kharagpur Division
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        {/* Left Side: Branding & Indian Railways Identity */}
        <div className="hidden lg:flex flex-col justify-between border-r border-slate-200/90 bg-[#f8fafc] p-8">
          <div>
            {/* Logo with increased size and clean presentation */}
            <div className="mb-5 flex items-center">
              <div className="relative h-12 w-56">
                <Image
                  src="/images/rail-sanket-logo.png"
                  alt="Rail Sanket"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 mb-2">
                <ShieldCheck className="size-3.5 text-blue-600" />
                Indian Railways Decision Support System
              </div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-snug">
                Automatic Corridor Block Planning &amp; Maintenance Bundling
              </h1>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Smart coordination for Engineering (TMS), Signalling (SMMS), and Traction (TDMS) maintenance possessions across Kharagpur Division to protect train schedules.
              </p>
            </div>

            {/* Locomotive Image Frame */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs mb-5">
              <Image
                src="/images/train-photo.jpg"
                alt="Indian Railways Locomotive"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <p className="text-xs font-semibold drop-shadow-sm">
                  South Eastern Railway · Kharagpur Division
                </p>
                <p className="text-[10px] text-slate-200 drop-shadow-sm">
                  Corridor Maintenance &amp; Traffic Block Coordination
                </p>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Integrated Engineering, S&amp;T &amp; TRD block bundling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Conflict detection against express train paths</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Planner-in-the-loop transparent decision logs</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>SIH26027 Prototype</span>
            <span>CRIS Railnet Operations</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex items-center justify-center p-4 sm:p-8 bg-white">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading…</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
