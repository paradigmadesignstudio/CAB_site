import type React from "react"
import { useEffect, useState } from "react"
import { router, usePage } from "@inertiajs/react"

import { cn } from "@/lib/utils"
import { useCabTranslationProtection } from "@/hooks/useCabTranslationProtection"
import { useLightMotion } from "@/hooks/useLightMotion"
import { Navigation } from "@/pages/components/layout/navigation"
import { Footer } from "@/pages/components/layout/footer"
import { FloatingContactButton } from "@/pages/components/layout/FloatingContactButton"
import { CookieNotice } from "@/pages/components/layout/CookieNotice"

function NavigationProgress() {
  const light = useLightMotion()
  const [active, setActive] = useState(false)

  useEffect(() => {
    const stopStart = router.on("start", () => setActive(true))
    const stopFinish = router.on("finish", () => setActive(false))

    return () => {
      stopStart()
      stopFinish()
    }
  }, [])

  if (light || !active) {
    return null
  }

  return (
    <div
      className="cab-nav-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-[#009739]"
      aria-hidden
    />
  )
}

function PageEnter({ children }: { children: React.ReactNode }) {
  const light = useLightMotion()
  const { url } = usePage()
  const path = url.split("?")[0] || "/"

  if (light) {
    return children
  }

  return (
    <div key={path} className="cab-page-enter">
      {children}
    </div>
  )
}

interface LayoutProps {
  children: React.ReactNode
  className?: string
  mainClassName?: string
}

export default function Layout({ children, className, mainClassName }: LayoutProps) {
  useCabTranslationProtection()

  return (
    <>
      <div className={cn("min-h-screen bg-background flex flex-col", className)}>
        <NavigationProgress />
        <Navigation />

        <main className={cn("flex-1 min-w-0", mainClassName)}>
          <PageEnter>{children}</PageEnter>
        </main>

        <Footer />

        <FloatingContactButton />
        <CookieNotice />
      </div>
    </>
  )
}
