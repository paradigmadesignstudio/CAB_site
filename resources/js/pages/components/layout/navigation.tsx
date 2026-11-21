import { useState, useEffect } from "react"
import { Link, router } from "@inertiajs/react"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { inertiaPrefetchPath, INERTIA_PREFETCH_HOVER } from "@/lib/inertiaPrefetch"
import { useSiteFeatures } from "@/hooks/useSiteFeatures"
import { TextWithCab } from "@/components/TextWithCab"
import { ASSOCIATE_AREA_URL, NAV_LINKS } from "@/pages/components/layout/data/navigation"

/** Reserva espaço no fluxo da página para a navbar fixa (logo + padding). */
export const NAVBAR_SPACER_CLASS = "h-20 sm:h-24 xl:h-28 shrink-0"

const NAV_SCROLL_OFFSET = 100

function scrollToElement(element: HTMLElement) {
  const top = element.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET

  window.scrollTo({ top, behavior: "smooth" })
}

export function Navigation() {
  const { oficinas } = useSiteFeatures()
  const navLinks = NAV_LINKS.filter((item) => oficinas || item.href !== "/oficinas")
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector<HTMLElement>(href)
      if (element) {
        scrollToElement(element)
      }
    } else if (href.includes('#')) {
      const [path, hash] = href.split('#')
      if (window.location.pathname === path) {
        const element = document.querySelector<HTMLElement>('#' + hash)
        if (element) {
          scrollToElement(element)
        }
      } else {
        router.visit(href)
      }
    } else {
      router.visit(href)
    }
    setMobileMenuOpen(false)
    setExpandedMobileItem(null)
  }

  const activeItem = navLinks.find((item) => item.label === activeSubmenu)
  const subLinks = activeItem?.subLinks ?? []

  // Desktop a partir de xl (1280px): iPad Pro 1024 mantém chrome mobile.
  const desktopAssociateButtonClass =
    "hidden items-center justify-center bg-[#319600] text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-transform hover:scale-105 active:scale-95 xl:inline-flex"

  const mobileAssociateButtonClass =
    "inline-flex items-center justify-center bg-[#319600] text-white px-5 py-3 rounded-full font-bold text-sm tracking-wide w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"

  return (
    <>
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md transition-shadow duration-500",
        scrolled && "shadow-sm",
      )}
      data-cab-manual="true"
      onMouseLeave={() => setActiveSubmenu(null)}
    >
      <div className="mx-auto grid max-w-7xl max-xl:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" prefetch={INERTIA_PREFETCH_HOVER} className="flex min-w-0 items-center justify-self-start">
          <div className="transition-transform duration-200 hover:scale-105">
            <img
              src="/images/geral/cab_sem_fundo.svg"
              alt="Câmbio Automático do Brasil"
              width={300}
              height={120}
              decoding="async"
              fetchPriority="low"
              className="h-14 w-auto max-w-[220px] object-contain sm:h-16 sm:max-w-[260px] xl:h-20 xl:max-w-[320px]"
            />
          </div>
        </Link>

        <div className="hidden items-center justify-center gap-6 xl:flex xl:gap-8">
          {navLinks.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.subLinks && setActiveSubmenu(item.label)}
            >
              <button
                type="button"
                onClick={() => scrollToSection(item.href)}
                onMouseEnter={() => inertiaPrefetchPath(item.href)}
                className="relative flex items-center text-sm font-bold tracking-wide text-[#003B7A]/80 transition-colors hover:text-[#009739] hover:scale-105 active:scale-95"
              >
                <TextWithCab text={item.label} />
                {item.subLinks && (
                  <svg className="ml-1 h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-self-end gap-2">
          <a
            href={ASSOCIATE_AREA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={desktopAssociateButtonClass}
          >
            Área do Assinante
          </a>

        <button
          type="button"
          className="p-2 shrink-0 transition-transform active:scale-90 xl:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="text-[#003B7A]" />
          ) : (
            <Menu className="text-[#003B7A]" />
          )}
        </button>
        </div>
      </div>

      <div
        className={cn(
          "hidden xl:block overflow-hidden bg-[#003B7A]/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-out",
          activeSubmenu && subLinks.length > 0 ? "max-h-24 opacity-100" : "max-h-0 opacity-0",
        )}
        onMouseEnter={() => setActiveSubmenu(activeSubmenu)}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <div className="flex flex-wrap justify-center gap-4 px-4 py-4 sm:gap-6 sm:px-6">
          {subLinks.map((sub) => (
            <button
              key={sub.label}
              type="button"
              onClick={() => scrollToSection(sub.href)}
              onMouseEnter={() => inertiaPrefetchPath(sub.href)}
              className="text-sm font-bold text-white/70 transition-colors hover:text-[#009739]"
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "xl:hidden overflow-hidden border-t border-white/10 bg-[#003B7A] transition-[max-height,opacity] duration-300 ease-out",
          mobileMenuOpen
            ? "max-h-[calc(100dvh-4.5rem)] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="space-y-1 px-4 py-5 sm:px-6">
          {navLinks.map((item) => (
            <div key={item.label}>
              {item.subLinks ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMobileItem((current) =>
                        current === item.label ? null : item.label,
                      )
                    }
                    className="flex w-full items-center justify-between py-3 text-left text-base font-semibold text-white/90 hover:text-[#AFFF00]"
                  >
                    <TextWithCab text={item.label} />
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedMobileItem === item.label && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden pl-3 transition-[max-height,opacity] duration-300",
                      expandedMobileItem === item.label
                        ? "max-h-64 pb-2 opacity-100"
                        : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="space-y-1">
                      {item.subLinks.map((sub) => (
                        <button
                          key={sub.label}
                          type="button"
                          onClick={() => scrollToSection(sub.href)}
                          onMouseEnter={() => inertiaPrefetchPath(sub.href)}
                          className="block w-full py-2 text-left text-sm text-white/70 hover:text-[#AFFF00]"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  onMouseEnter={() => inertiaPrefetchPath(item.href)}
                  className="block w-full py-3 text-left text-base font-semibold text-white/90 hover:text-[#AFFF00]"
                >
                  <TextWithCab text={item.label} />
                </button>
              )}
            </div>
          ))}

          <div className="border-t border-white/10 pt-4">
            <a
              href={ASSOCIATE_AREA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={mobileAssociateButtonClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Área do Assinante
            </a>
          </div>
        </div>
      </div>
    </nav>
    <div aria-hidden className={NAVBAR_SPACER_CLASS} />
    </>
  )
}
