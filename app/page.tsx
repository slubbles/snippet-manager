'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Code2, FolderOpen, Link2, Search, Sun, Shield, Zap, Clock, ChevronDown, Menu, X } from 'lucide-react'
import { ThemeLogo } from '@/components/theme-logo'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-black">
      {/* --- Nav --- */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <ThemeLogo size={32} />
            <span className="text-[18px] font-semibold leading-[27px] text-black dark:text-white">
              Snip Labs
            </span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden items-center gap-3 sm:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-[14px] font-medium leading-[23.8px] text-black/70 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-[22px] bg-black dark:bg-white px-5 py-2.5 text-[14px] font-medium leading-[23.8px] text-white dark:text-black shadow-lg shadow-black/10 hover:bg-black/80 dark:hover:bg-white/80 transition-all"
            >
              Get Started
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-black/70 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10 sm:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-black/10 px-5 py-4 dark:border-white/10 sm:hidden">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-1">
                <ThemeToggle />
                <span className="text-[14px] text-black/60 dark:text-white/60">Toggle theme</span>
              </div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-black/70 hover:bg-black/[0.03] dark:text-white/60 dark:hover:bg-white/10 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[22px] bg-black dark:bg-white px-5 py-3 text-center text-[14px] font-medium text-white dark:text-black shadow-lg shadow-black/10 hover:bg-black/80 dark:hover:bg-white/80 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero --- */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-10 pb-20 sm:px-8 md:pt-14 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-4 py-1.5 text-[12px] font-semibold leading-[20.4px] text-black/70 dark:border-white/15 dark:bg-white/5 dark:text-white/70">
              <Zap size={13} />
              Your personal knowledge base
            </div>
            <h1 className="mb-5 text-[36px] font-semibold leading-[1.15] tracking-tight text-black dark:text-white sm:text-[44px] md:text-[52px]">
              Stop losing the code that matters most
            </h1>
            <p className="mb-8 text-[16px] font-normal leading-[26px] text-black/60 dark:text-white/60 sm:text-[18px] sm:leading-[28px]">
              Snip Labs lets you save, organize, and find code snippets, links, and notes in seconds — so you can stop searching and start building.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="rounded-[22px] bg-black dark:bg-white px-7 py-3.5 text-[14px] font-semibold leading-[23.8px] text-white dark:text-black shadow-xl shadow-black/15 hover:bg-black/80 dark:hover:bg-white/80 hover:shadow-black/20 transition-all"
              >
                Start for free
              </Link>
              <Link
                href="#use-cases"
                className="rounded-[18px] border border-black/15 px-6 py-3 text-[14px] font-medium leading-[23.8px] text-black/70 hover:bg-black/[0.03] dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10 transition-all"
              >
                See how it works
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <Image
              src="/images/hero-section.webp"
              alt="Organize your code snippets"
              width={900}
              height={900}
              className="w-full lg:scale-115 lg:translate-x-6 object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* --- Use Cases --- */}
      <section id="use-cases" className="border-t border-black/10 bg-black/[0.02] py-20 dark:border-white/10 dark:bg-black md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <UseCaseCard icon={<FolderOpen size={22} />} title="Organize by project" description="Group your snippets into folders that mirror how you actually work. Rename or restructure anytime without losing a thing." />
            <UseCaseCard icon={<Link2 size={22} />} title="Paste a link, get the title" description="Drop any URL and Snip Labs pulls the page title automatically — no more mysterious bookmarks or unnamed tabs." />
            <UseCaseCard icon={<Search size={22} />} title="Find anything instantly" description="Real-time search across every snippet as you type. Hit Ctrl+K and you're there in milliseconds, not minutes." />
            <UseCaseCard icon={<Sun size={22} />} title="Light or dark, your call" description="Switch themes with one click. Your preference sticks between sessions so the UI always feels like yours." />
          </div>
        </div>
      </section>

      {/* --- Benefits Carousel --- */}
      <section className="py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-black dark:text-white sm:text-[32px]">
              Built for developers who value their time
            </h2>
            <p className="text-[16px] font-normal leading-[26px] text-black/60 dark:text-white/60">
              Not another notes app. Snip Labs is purpose-built for saving and retrieving the code, links, and references you actually use.
            </p>
          </div>
        </div>
        <BenefitsCarousel />
      </section>

      {/* --- FAQ --- */}
      <section className="border-t border-black/10 bg-black/[0.02] py-20 dark:border-white/10 dark:bg-black md:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="mb-12 text-center text-[28px] font-semibold leading-[1.2] tracking-tight text-black dark:text-white sm:text-[32px]">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            <FAQItem question="Is Snip Labs free to use?" answer="Yes. Snip Labs is completely free — unlimited snippets, unlimited folders, no credit card required." />
            <FAQItem question="Do I need to install anything?" answer="No. Snip Labs runs entirely in your browser. Sign up and start saving snippets in seconds." />
            <FAQItem question="Can I organize snippets by project?" answer="Absolutely. Create as many folders as you want and nest your snippets however makes sense for your workflow." />
            <FAQItem question="What languages does syntax highlighting support?" answer="JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby, SQL, HTML, CSS, JSON, Bash, Markdown, YAML, and Dockerfile — 17 languages out of the box." />
            <FAQItem question="Is my data private?" answer="Yes. Every account is fully isolated. Your snippets and folders are only visible to you, always." />
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="mb-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-black dark:text-white sm:text-[36px]">
            Ready to stop losing code?
          </h2>
          <p className="mb-8 text-[16px] font-normal leading-[26px] text-black/60 dark:text-white/60 sm:text-[18px] sm:leading-[28px]">
            Join developers who save hours every week by keeping their best snippets one search away.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-[22px] bg-black dark:bg-white px-8 py-4 text-[16px] font-semibold text-white dark:text-black shadow-xl shadow-black/15 hover:bg-black/80 dark:hover:bg-white/80 hover:shadow-black/20 transition-all"
          >
            Create your free account
          </Link>
          <p className="mt-4 text-[12px] font-normal leading-[20.4px] text-black/40 dark:text-white/40">
            No credit card · Free forever · Takes 10 seconds
          </p>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-black/10 px-5 py-8 dark:border-white/10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <ThemeLogo size={24} />
            <span className="text-[14px] font-medium leading-[23.8px] text-black dark:text-white">Snip Labs</span>
          </div>
          <p className="text-[12px] font-normal leading-[20.4px] text-black/40 dark:text-white/40">
            Built with Next.js, Tailwind CSS, and Neon PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  )
}

/* --- Subcomponents --- */

const benefitCards = [
  { icon: 'zap', title: 'Zero friction', description: 'Create a snippet in under 5 seconds. No tags, no categories, no overhead — just paste and go.' },
  { icon: 'folder', title: 'Your workflow, your structure', description: 'Organize by project, language, or topic. Move things around without breaking anything.' },
  { icon: 'search', title: "Recall, don't remember", description: 'Type a few letters and find exactly what you need. Your brain stores ideas — Snip Labs stores the code.' },
  { icon: 'shield', title: 'Private by default', description: 'Your snippets are yours. Each account is isolated with per-user data scoping from day one.' },
  { icon: 'clock', title: 'Always synced', description: 'Access your entire library from any device. Cloud-backed, fast, and available whenever you need it.' },
  { icon: 'code', title: 'Syntax highlighting', description: '17 languages supported out of the box. Your code looks exactly like it does in your editor.' },
]

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap size={20} />,
  folder: <FolderOpen size={20} />,
  search: <Search size={20} />,
  shield: <Shield size={20} />,
  clock: <Clock size={20} />,
  code: <Code2 size={20} />,
}

function BenefitsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId: number
    let scrollPos = 0
    const speed = 0.5 // px per frame

    const step = () => {
      if (!isPaused) {
        scrollPos += speed
        // Reset when we've scrolled through one full set of cards
        const halfWidth = el.scrollWidth / 2
        if (scrollPos >= halfWidth) {
          scrollPos = 0
        }
        el.scrollLeft = scrollPos
      }
      animationId = requestAnimationFrame(step)
    }

    animationId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationId)
  }, [isPaused])

  // Duplicate cards for seamless loop
  const cards = [...benefitCards, ...benefitCards]

  return (
    <div
      ref={scrollRef}
      className="flex gap-5 overflow-hidden px-5 sm:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {cards.map((card, i) => (
        <div
          key={`${card.icon}-${i}`}
          className="group w-[280px] sm:w-[320px] shrink-0 rounded-[20px] border border-black/10 bg-white p-6 transition-all hover:border-black/20 hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 text-black dark:text-white transition-colors group-hover:bg-black/15 dark:bg-black/15 dark:group-hover:bg-black/25">
            {iconMap[card.icon]}
          </div>
          <h3 className="mb-2 text-[16px] font-medium leading-[24px] text-black dark:text-white">{card.title}</h3>
          <p className="text-[14px] font-normal leading-[23.8px] text-black/60 dark:text-white/60">{card.description}</p>
        </div>
      ))}
    </div>
  )
}

function UseCaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-[20px] border border-black/10 bg-white p-6 transition-all hover:border-black/20 hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:bg-black dark:hover:border-white/20">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 text-black dark:text-white transition-colors group-hover:bg-black/15 dark:bg-black/15 dark:group-hover:bg-black/25">
        {icon}
      </div>
      <h3 className="mb-2 text-[16px] font-medium leading-[24px] text-black dark:text-white">{title}</h3>
      <p className="text-[14px] font-normal leading-[23.8px] text-black/60 dark:text-white/60">{description}</p>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-black/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-black [&[open]]:pb-5">
      <summary className="flex cursor-pointer items-center justify-between text-[16px] font-medium leading-[24px] text-black marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
        {question}
        <ChevronDown size={18} className="shrink-0 text-black dark:text-white transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-[14px] font-normal leading-[23.8px] text-black/60 dark:text-white/60">{answer}</p>
    </details>
  )
}
