'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Code2, FolderOpen, Link2, Search, Sun, Shield, Zap, Clock, ChevronDown, Menu, X } from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-[#091413]">
      {/* â”€â”€â”€ Nav â”€â”€â”€ */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-[#091413]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="text-[18px] font-semibold leading-[27px] text-gray-900 dark:text-white">
              Snip Labs
            </span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-[14px] font-medium leading-[23.8px] text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-[22px] bg-brand-500 px-5 py-2.5 text-[14px] font-medium leading-[23.8px] text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all"
            >
              Get Started
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 sm:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200/60 px-5 py-4 dark:border-zinc-800/60 sm:hidden">
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[22px] bg-brand-500 px-5 py-3 text-center text-[14px] font-medium text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* â”€â”€â”€ Hero â”€â”€â”€ */}
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 pb-20 sm:px-8 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-[12px] font-semibold leading-[20.4px] text-brand-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-brand-200">
              <Zap size={13} />
              Your personal knowledge base
            </div>
            <h1 className="mb-5 text-[36px] font-semibold leading-[1.15] tracking-tight text-gray-900 dark:text-white sm:text-[44px] md:text-[52px]">
              Stop losing the code that matters most
            </h1>
            <p className="mb-8 text-[16px] font-normal leading-[26px] text-gray-500 dark:text-zinc-400 sm:text-[18px] sm:leading-[28px]">
              Snip Labs lets you save, organize, and find code snippets, links, and notes in seconds â€” so you can stop searching and start building.
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
                className="rounded-[18px] border border-gray-300 px-6 py-3 text-[14px] font-medium leading-[23.8px] text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
              >
                See how it works
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[24px] border border-gray-200/50 bg-gray-50 shadow-2xl shadow-black/5 dark:border-zinc-700/40 dark:bg-zinc-800/50 dark:shadow-black/30">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80"
                alt="Code editor with organized snippets"
                width={800}
                height={500}
                className="w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl border border-gray-200/50 bg-white px-4 py-2.5 shadow-lg dark:border-zinc-700/50 dark:bg-[#0d1f1b] sm:-bottom-5 sm:-left-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/15 dark:bg-brand-500/20">
                <Shield size={15} className="text-brand-500" />
              </div>
              <div>
                <p className="text-[12px] font-semibold leading-[20.4px] text-gray-900 dark:text-white">Private & secure</p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">Your data, your control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Use Cases â”€â”€â”€ */}
      <section id="use-cases" className="border-t border-gray-200/60 bg-gray-50/50 py-20 dark:border-zinc-800/40 dark:bg-[#0a1a17] md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <UseCaseCard icon={<FolderOpen size={22} />} title="Organize by project" description="Group your snippets into folders that mirror how you actually work. Rename or restructure anytime without losing a thing." />
            <UseCaseCard icon={<Link2 size={22} />} title="Paste a link, get the title" description="Drop any URL and Snip Labs pulls the page title automatically â€” no more mysterious bookmarks or unnamed tabs." />
            <UseCaseCard icon={<Search size={22} />} title="Find anything instantly" description="Real-time search across every snippet as you type. Hit Ctrl+K and you're there in milliseconds, not minutes." />
            <UseCaseCard icon={<Sun size={22} />} title="Light or dark, your call" description="Switch themes with one click. Your preference sticks between sessions so the UI always feels like yours." />
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Why / Benefits â”€â”€â”€ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-gray-900 dark:text-white sm:text-[32px]">
              Built for developers who value their time
            </h2>
            <p className="text-[16px] font-normal leading-[26px] text-gray-500 dark:text-zinc-400">
              Not another notes app. Snip Labs is purpose-built for saving and retrieving the code, links, and references you actually use.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={<Zap size={20} />} title="Zero friction" description="Create a snippet in under 5 seconds. No tags, no categories, no overhead â€” just paste and go." />
            <BenefitCard icon={<FolderOpen size={20} />} title="Your workflow, your structure" description="Organize by project, language, or topic. Move things around without breaking anything." />
            <BenefitCard icon={<Search size={20} />} title="Recall, don't remember" description="Type a few letters and find exactly what you need. Your brain stores ideas â€” Snip Labs stores the code." />
            <BenefitCard icon={<Shield size={20} />} title="Private by default" description="Your snippets are yours. Each account is isolated with per-user data scoping from day one." />
            <BenefitCard icon={<Clock size={20} />} title="Always synced" description="Access your entire library from any device. Cloud-backed, fast, and available whenever you need it." />
            <BenefitCard icon={<Code2 size={20} />} title="Syntax highlighting" description="17 languages supported out of the box. Your code looks exactly like it does in your editor." />
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ FAQ â”€â”€â”€ */}
      <section className="border-t border-gray-200/60 bg-gray-50/50 py-20 dark:border-zinc-800/40 dark:bg-[#0a1a17] md:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="mb-12 text-center text-[28px] font-semibold leading-[1.2] tracking-tight text-gray-900 dark:text-white sm:text-[32px]">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            <FAQItem question="Is Snip Labs free to use?" answer="Yes. Snip Labs is completely free â€” unlimited snippets, unlimited folders, no credit card required." />
            <FAQItem question="Do I need to install anything?" answer="No. Snip Labs runs entirely in your browser. Sign up and start saving snippets in seconds." />
            <FAQItem question="Can I organize snippets by project?" answer="Absolutely. Create as many folders as you want and nest your snippets however makes sense for your workflow." />
            <FAQItem question="What languages does syntax highlighting support?" answer="JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, Ruby, SQL, HTML, CSS, JSON, Bash, Markdown, YAML, and Dockerfile â€” 17 languages out of the box." />
            <FAQItem question="Is my data private?" answer="Yes. Every account is fully isolated. Your snippets and folders are only visible to you, always." />
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ CTA â”€â”€â”€ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="mb-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-gray-900 dark:text-white sm:text-[36px]">
            Ready to stop losing code?
          </h2>
          <p className="mb-8 text-[16px] font-normal leading-[26px] text-gray-500 dark:text-zinc-400 sm:text-[18px] sm:leading-[28px]">
            Join developers who save hours every week by keeping their best snippets one search away.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-[22px] bg-brand-500 px-8 py-4 text-[16px] font-semibold text-white shadow-xl shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-700/30 transition-all"
          >
            Create your free account
          </Link>
          <p className="mt-4 text-[12px] font-normal leading-[20.4px] text-gray-400 dark:text-zinc-500">
            No credit card Â· Free forever Â· Takes 10 seconds
          </p>
        </div>
      </section>

      {/* â”€â”€â”€ Footer â”€â”€â”€ */}
      <footer className="border-t border-gray-200/60 px-5 py-8 dark:border-zinc-800/40 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="text-[14px] font-medium leading-[23.8px] text-gray-900 dark:text-white">Snip Labs</span>
          </div>
          <p className="text-[12px] font-normal leading-[20.4px] text-gray-400 dark:text-zinc-500">
            Built with Next.js, Tailwind CSS, and Neon PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  )
}

/* â”€â”€â”€ Subcomponents â”€â”€â”€ */

function UseCaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-[20px] border border-gray-200/50 bg-white p-6 transition-all hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 dark:border-zinc-700/30 dark:bg-[#0d1f1b] dark:hover:border-brand-500/30">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500/15 dark:bg-brand-500/15 dark:group-hover:bg-brand-500/25">
        {icon}
      </div>
      <h3 className="mb-2 text-[16px] font-medium leading-[24px] text-gray-900 dark:text-white">{title}</h3>
      <p className="text-[14px] font-normal leading-[23.8px] text-gray-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 dark:bg-brand-500/15">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 text-[16px] font-medium leading-[24px] text-gray-900 dark:text-white">{title}</h3>
        <p className="text-[14px] font-normal leading-[23.8px] text-gray-500 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-gray-200/50 bg-white px-6 py-5 dark:border-zinc-700/30 dark:bg-[#0d1f1b] [&[open]]:pb-5">
      <summary className="flex cursor-pointer items-center justify-between text-[16px] font-medium leading-[24px] text-gray-900 marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
        {question}
        <ChevronDown size={18} className="shrink-0 text-brand-500 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-[14px] font-normal leading-[23.8px] text-gray-500 dark:text-zinc-400">{answer}</p>
    </details>
  )
}
