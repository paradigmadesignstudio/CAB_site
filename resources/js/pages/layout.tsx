import type React from "react"

import { cn } from "@/lib/utils"
import { useCabTranslationProtection } from "@/hooks/useCabTranslationProtection"
import { Navigation } from "@/pages/components/layout/navigation"
import { Footer } from "@/pages/components/layout/footer"
import { FloatingContactButton } from "@/pages/components/layout/FloatingContactButton"
import { CookieNotice } from "@/pages/components/layout/CookieNotice"

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
        <Navigation />

        <main className={cn("flex-1 min-w-0", mainClassName)}>
          {children}
        </main>

        <Footer />

        <FloatingContactButton />
        <CookieNotice />
      </div>
    </>
  )
}
