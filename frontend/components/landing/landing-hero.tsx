'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  CalendarClock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export function LandingHero() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleDashboardClick = () => {
    router.push('/auth')
  }

  return (
    <section id="home" className="relative overflow-hidden min-h-[600px] lg:min-h-[660px] flex items-center pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      
      {/* FULL BACKGROUND IMAGE: Nilgiri Mountain Railway Train crossing bridge */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nilgiri-train-bridge.jpg"
          alt="Indian Railways train crossing mountain viaduct bridge"
          fill
          className="object-cover object-center lg:object-[center_35%]"
          priority
        />
        
        {/* LIGHTER GRADIENT OVERLAYS:
            - Stronger on the left to keep text ultra-sharp & readable
            - Feathering to transparent on the right so the train and lush mountains are clearly visible! */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />
      </div>

      {/* FOREGROUND CONTENT: Strictly Left-Aligned with Premium Tech Typography */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl lg:max-w-2xl space-y-6">
          
          {/* Tech Pill Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-slate-950/70 px-4 py-1.5 text-xs font-semibold text-sky-200 shadow-md backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="tracking-wide">AI-Assisted Railway Maintenance Planning</span>
          </div>

          {/* Main Heading with Modern Tech Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight text-white leading-[1.12] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            AI-Powered Automatic Block Planning{' '}
            <span className="block mt-1.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-black drop-shadow-sm">
              for Smarter Railway Maintenance
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] max-w-xl">
            A decision-support platform that combines maintenance requirements,
            available railway block windows and operational constraints to create
            efficient weekly and monthly maintenance plans.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button
              size="lg"
              onClick={handleDashboardClick}
              className="gap-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold text-base px-6 h-12 shadow-lg shadow-blue-500/30 rounded-xl border border-sky-400/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="size-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 bg-black/40 hover:bg-black/60 text-white border-white/25 backdrop-blur-md font-medium text-base px-5 h-12 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              <a href="#how-it-works">
                <span>How It Works</span>
                <ChevronRight className="size-4 text-slate-300" />
              </a>
            </Button>
          </div>

          {/* Tech Feature Badges Strip (Human-in-the-loop, bundling, rosters) */}
          <div className="pt-6 border-t border-white/20 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-100">
            <div className="inline-flex items-center gap-2 rounded-lg bg-black/45 border border-white/15 px-3 py-1.5 backdrop-blur-sm shadow-xs">
              <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
              <span>Human-in-the-Loop Safe Sanction</span>
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-lg bg-black/45 border border-white/15 px-3 py-1.5 backdrop-blur-sm shadow-xs">
              <CheckCircle2 className="size-3.5 text-sky-400 shrink-0" />
              <span>Multi-Department Bundling (TMS, SMMS, TDMS)</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg bg-black/45 border border-white/15 px-3 py-1.5 backdrop-blur-sm shadow-xs">
              <CalendarClock className="size-3.5 text-amber-400 shrink-0" />
              <span>Weekly &amp; Monthly Schedules</span>
            </div>
          </div>

        </div>
      </div>

      {/* Subtle Bottom-Right Indian Railways Heritage Badge */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:block">
        <div className="rounded-full bg-black/45 border border-white/15 px-3 py-1 text-[11px] text-slate-200 backdrop-blur-md shadow-xs">
          Nilgiri Mountain Railway &middot; Indian Railways
        </div>
      </div>

    </section>
  )
}
