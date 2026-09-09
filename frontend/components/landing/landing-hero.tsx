'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  CalendarClock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export function LandingHero() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/auth?redirect=/dashboard')
    }
  }

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              <span>AI-Assisted Railway Maintenance Planning</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              AI-Powered Automatic Block Planning{' '}
              <span className="text-primary block sm:inline">
                for Smarter Railway Maintenance
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              A decision-support platform that combines maintenance requirements,
              available railway block windows and operational constraints to create
              efficient weekly and monthly maintenance plans.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={handleDashboardClick}
                className="gap-2.5 bg-primary hover:bg-primary/95 text-white font-semibold text-base px-6 h-12 shadow-sm rounded-lg"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="size-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-base px-5 h-12 rounded-lg"
              >
                <a href="#how-it-works">
                  <span>How It Works</span>
                  <ChevronRight className="size-4 text-slate-400" />
                </a>
              </Button>
            </div>

            {/* Sub-strip indicator */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>Human-in-the-Loop Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Multi-Department Bundling (TMS, SMMS, TDMS)</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 text-amber-600 shrink-0" />
                <span>Weekly &amp; Monthly Schedules</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Visual Frame with Floating Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer border & shadow wrapper */}
              <div className="relative rounded-2xl border border-slate-200/90 bg-white p-2 shadow-lg sm:p-3 overflow-hidden group">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="/images/railway-track-hero.jpg"
                    alt="Modern Indian Railway corridor tracks and electric catenary infrastructure"
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  {/* Subtle Gradient Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                  
                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-200 block">
                      Indian Railways Corridor Infrastructure
                    </span>
                    <span className="text-xs font-medium text-slate-100">
                      Kharagpur – Tatanagar Mainline Route
                    </span>
                  </div>
                </div>

                {/* Floating Card 1: Maintenance Planning */}
                <div className="absolute top-6 left-6 rounded-lg border border-white/80 bg-white/95 px-3 py-2 shadow-md backdrop-blur-xs flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-md bg-blue-50 text-primary">
                    <CalendarClock className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Maintenance Planning</div>
                    <div className="text-[10px] text-slate-500">Weekly + Monthly</div>
                  </div>
                </div>

                {/* Floating Card 2: AI-Assisted */}
                <div className="absolute bottom-16 right-6 rounded-lg border border-white/80 bg-white/95 px-3 py-2 shadow-md backdrop-blur-xs flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">AI-Assisted</div>
                    <div className="text-[10px] text-emerald-700 font-medium">83% Block Utilization</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
