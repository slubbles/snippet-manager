'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { ThemeLogo } from '@/components/theme-logo'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Name is required')
          setLoading(false)
          return
        }
        const { error: signUpError } = await signUp.email({
          name: name.trim(),
          email,
          password,
          callbackURL: '/dashboard',
        })
        if (signUpError) {
          setError(signUpError.message || 'Failed to create account')
          setLoading(false)
          return
        }
      } else {
        const { error: signInError } = await signIn.email({
          email,
          password,
          callbackURL: '/dashboard',
        })
        if (signInError) {
          setError(signInError.message || 'Invalid email or password')
          setLoading(false)
          return
        }
      }
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full bg-white dark:bg-[#091413]">
      {/* Left column — Form */}
      <div className="flex w-full flex-col justify-center px-6 py-6 sm:py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-8">
          {/* Logo + back link */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <ThemeLogo size={36} />
              <span className="text-[20px] font-medium leading-[23px]">Snip Labs</span>
            </Link>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-[28px] font-semibold leading-[1.2] tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-[14px] leading-[23.8px] text-[#091413]/60 dark:text-white/60">
              {mode === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => { setMode('signup'); setError('') }}
                    className="font-medium text-brand-500 hover:text-brand-200"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('signin'); setError('') }}
                    className="font-medium text-brand-500 hover:text-brand-200"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="mb-1 block text-[12px] font-semibold leading-[20.4px] text-[#091413]/70 dark:text-white/60">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[#091413]/15 bg-white px-3 py-2.5 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/15 dark:bg-white/5 dark:focus:border-brand-500"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1 block text-[12px] font-semibold leading-[20.4px] text-[#091413]/70 dark:text-white/60">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#091413]/15 bg-white px-3 py-2.5 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/15 dark:bg-white/5 dark:focus:border-brand-500"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-[12px] font-semibold leading-[20.4px] text-[#091413]/70 dark:text-white/60">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#091413]/15 bg-white px-3 py-2.5 pr-10 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/15 dark:bg-white/5 dark:focus:border-brand-500"
                  placeholder="Min 8 characters"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#091413]/40 hover:text-[#091413]/70 dark:text-white/40 dark:hover:text-white/70"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 px-3 py-2 text-[14px] leading-[23.8px] text-red-500">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-[14px] font-medium leading-[23.8px] text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>
        </div>
      </div>

      {/* Right column — Image (desktop only) */}
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="/images/login-bg.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#091413]/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-[28px] font-semibold leading-[1.2] tracking-tight text-white">
            Capturing Moments,
            <br />
            Creating Memories
          </p>
        </div>
      </div>
    </div>
  )
}
