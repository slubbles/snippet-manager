'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Code2, FolderOpen, Link2, Search, Sun, Shield, Zap, Clock, ChevronDown, Menu, X } from 'lucide-react'
import { StylizedText } from '@/components/stylized-text'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-brand-900">
      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 border-b border-brand-200/30 bg-white/80 backdrop-blur-md dark:border-brand-700/30 dark:bg-brand-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="text-[18px] font-semibold leading-[27px] text-brand-900 dark:text-white">
              Snippet<span className="bagoss-g">V</span>ault
            </span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-[14px] font-medium leading-[23.8px] text-brand-700 hover:text-brand-900 dark:text-brand-200 dark:hover:text-white transition-colors"
            >
              Si<span className="bagoss-g">g</span>n in
            </Link>
            <Link
              href="/login"
              className="rounded-[22px] bg-brand-500 px-5 py-2.5 text-[14px] font-medium leading-[23.8px] text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all"
            >
              <StylizedText>Get Started</StylizedText>
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-700 hover:bg-brand-100 dark:text-brand-200 dark:hover:bg-brand-700/30 sm:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-brand-200/30 px-5 py-4 dark:border-brand-700/30 sm:hidden">
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-brand-700 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-brand-700/20 transition-colors"
              >
                Si<span className="bagoss-g">g</span>n in
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[22px] bg-brand-500 px-5 py-3 text-center text-[14px] font-medium text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all"
              >
                <StylizedText>Get Started</StylizedText>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 pb-20 sm:px-8 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy */}
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-[12px] font-semibold leading-[20.4px] text-brand-700 dark:border-brand-700 dark:bg-brand-700/20 dark:text-brand-200">
              <Zap size={13} />
              Your personal knowled<span className="bagoss-g">g</span>e base
            </div>
            <h1 className="mb-5 text-[36px] font-semibold leading-[1.15] tracking-tight text-brand-900 dark:text-white sm:text-[44px] md:text-[52px]">
              Stop losin<span className="bagoss-g">g</span> the code that matters most
            </h1>
            <p className="mb-8 text-[16px] font-normal leading-[26px] text-brand-900/70 dark:text-brand-200/70 sm:text-[18px] sm:leading-[28px]">
              SnippetVault lets you save, or<span className="bagoss-g">g</span>anize, and find code snippets, links, and notes in seconds — so you can stop searchin<span className="bagoss-g">g</span> and start buildin<span className="bagoss-g">g</span>.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="rounded-[22px] bg-brand-500 px-7 py-3.5 text-[14px] font-semibold leading-[23.8px] text-white shadow-xl shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-700/30 transition-all"
              >
                Start for free
              </Link>
              <Link
                href="#use-cases"
                className="rounded-[18px] border border-brand-200 px-6 py-3 text-[14px] font-medium leading-[23.8px] text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-200 dark:hover:bg-brand-700/20 transition-all"
              >
                See how it works
              </Link>
            </div>
          </div>
          {/* Right — image */}
          <div className="relative">
            <div className="overflow-hidden rounded-[24px] border border-brand-200/50 bg-brand-50 shadow-2xl shadow-brand-500/10 dark:border-brand-700/40 dark:bg-brand-700/20 dark:shadow-brand-900/50">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80"
                alt="Code editor with organized snippets"
                width={800}
                height={500}
                className="w-full object-cover"
                priority
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl border border-brand-200/50 bg-white px-4 py-2.5 shadow-lg dark:border-brand-700/50 dark:bg-brand-900 sm:-bottom-5 sm:-left-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-200/50 dark:bg-brand-700/40">
                <Shield size={15} className="text-brand-500" />
              </div>
              <div>
                <p className="text-[12px] font-semibold leading-[20.4px] text-brand-900 dark:text-white">Private & secure</p>
                <p className="text-[11px] text-brand-700/60 dark:text-brand-200/50">Your data, your control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Use Cases ─── */}
      <section id="use-cases" className="border-t border-brand-200/40 bg-brand-50/50 py-20 dark:border-brand-700/20 dark:bg-brand-900/80 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <UseCaseCard
              icon={<FolderOpen size={22} />}
              title="Organize by project"
              description="Group your snippets into folders that mirror how you actually work. Rename or restructure anytime without losing a thing."
            />
            <UseCaseCard
              icon={<Link2 size={22} />}
              title="Paste a link, get the title"
              description="Drop any URL and SnippetVault pulls the page title automatically — no more mysterious bookmarks or unnamed tabs."
            />
            <UseCaseCard
              icon={<Search size={22} />}
              title="Find anything instantly"
              description="Real-time search across every snippet as you type. Hit Ctrl+K and you're there in milliseconds, not minutes."
            />
            <UseCaseCard
              icon={<Sun size={22} />}
              title="Light or dark, your call"
              description="Switch themes with one click. Your preference sticks between sessions so the UI always feels like yours."
            />
          </div>
        </div>
      </section>

      {/* ─── Why / Benefits ─── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-brand-900 dark:text-white sm:text-[32px]">
              Built for developers who value their time
            </h2>
            <p className="text-[16px] font-normal leading-[26px] text-brand-900/60 dark:text-brand-200/60">
              Not another notes app. SnippetVault is purpose-built for savin<span className="bagoss-g">g</span> and retrievin<span className="bagoss-g">g</span> the code, links, and references you actually use.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon={<Zap size={20} />}
              title="Zero friction"
              description="Create a snippet in under 5 seconds. No tags, no categories, no overhead — just paste and go."
            />
            <BenefitCard
              icon={<FolderOpen size={20} />}
              title="Your workflow, your structure"
              description="Organize by project, language, or topic. Move things around without breaking anything."
            />
            <BenefitCard
              icon={<Search size={20} />}
              title="Recall, don't remember"
              description="Type a few letters and find exactly what you need. Your brain stores ideas — SnippetVault stores the code."
            />
            <BenefitCard
              icon={<Shield size={20} />}
              title="Private by default"
              description="Your snippets are yours. Each account is isolated with per-user data scoping from day one."
            />
            <BenefitCard
              icon={<Clock size={20} />}
              title="Always synced"
              description="Access your entire library from any device. Cloud-backed, fast, and available whenever you need it."
            />
            <BenefitCard
              icon={<Code2 size={20} />}
              title="Syntax highlighting"
              description="17 languages supported out of the box. Your code looks exactly like it does in your editor."
            />
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-brand-200/40 bg-brand-50/50 py-20 dark:border-brand-700/20 dark:bg-brand-900/80 md:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="mb-12 text-center text-[28px] font-semibold leading-[1.2] tracking-tight text-brand-900 dark:text-white sm:text-[32px]">
            <StylizedText>Frequently asked questions</StylizedText>
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="Is SnippetVault free to use?"
              answer="Yes. SnippetVault is completely free — unlimited snippets, unlimited folders, no credit card required."
            />
            <FAQItem
              question="Do I need to install anything?"
              answer="No. SnippetVault runs entirely in your browser. Sign up and start saving snippets in seconds."
            />
            <FAQItem
              question="Can I organize snippets by project?"
              answer="Absolutely. Create as many folders as you want and nest your snippets however makes sense for your workflow."
            />
            <FAQItem
              question="What languages does syntax highlighting support?"
              answer="JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby, SQL, HTML, CSS, JSON, Bash, Markdown, YAML, and Dockerfile — 17 languages out of the box."
            />
            <FAQItem
              question="Is my data private?"
              answer="Yes. Every account is fully isolated. Your snippets and folders are only visible to you, always."
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="mb-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-brand-900 dark:text-white sm:text-[36px]">
            Ready to stop losin<span className="bagoss-g">g</span> code?
          </h2>
          <p className="mb-8 text-[16px] font-normal leading-[26px] text-brand-900/60 dark:text-brand-200/60 sm:text-[18px] sm:leading-[28px]">
            Join developers who save hours every week by keepin<span className="bagoss-g">g</span> their best snippets one search away.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-[22px] bg-brand-500 px-8 py-4 text-[16px] font-semibold text-white shadow-xl shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-700/30 transition-all"
          >
            Create your free account
          </Link>
          <p className="mt-4 text-[12px] font-normal leading-[20.4px] text-brand-900/40 dark:text-brand-200/40">
            No credit card · Free forever · Takes 10 seconds
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-brand-200/40 px-5 py-8 dark:border-brand-700/20 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="text-[14px] font-medium leading-[23.8px] text-brand-900 dark:text-white">SnippetVault</span>
          </div>
          <p className="text-[12px] font-normal leading-[20.4px] text-brand-900/40 dark:text-brand-200/40">
            Built with Next.js, Tailwind CSS, and Neon Post<span className="bagoss-g">g</span>reSQL
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ─── Subcomponents ─── */

function UseCaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-[20px] border border-brand-200/50 bg-white p-6 transition-all hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 dark:border-brand-700/30 dark:bg-brand-900 dark:hover:border-brand-500/30">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-500 transition-colors group-hover:bg-brand-200/60 dark:bg-brand-700/30 dark:group-hover:bg-brand-700/50">
        {icon}
      </div>
      <h3 className="mb-2 text-[16px] font-medium leading-[24px] text-brand-900 dark:text-white">
        <StylizedText>{title}</StylizedText>
      </h3>
      <p className="text-[14px] font-normal leading-[23.8px] text-brand-900/60 dark:text-brand-200/60">
        <StylizedText>{description}</StylizedText>
      </p>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-500 dark:bg-brand-700/30">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 text-[16px] font-medium leading-[24px] text-brand-900 dark:text-white">
          <StylizedText>{title}</StylizedText>
        </h3>
        <p className="text-[14px] font-normal leading-[23.8px] text-brand-900/60 dark:text-brand-200/60">
          <StylizedText>{description}</StylizedText>
        </p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-brand-200/50 bg-white px-6 py-5 dark:border-brand-700/30 dark:bg-brand-900 [&[open]]:pb-5">
      <summary className="flex cursor-pointer items-center justify-between text-[16px] font-medium leading-[24px] text-brand-900 marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
        <StylizedText>{question}</StylizedText>
        <ChevronDown size={18} className="shrink-0 text-brand-500 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-[14px] font-normal leading-[23.8px] text-brand-900/60 dark:text-brand-200/60">
        <StylizedText>{answer}</StylizedText>
      </p>
    </details>
  )
}
