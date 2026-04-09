'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code2, Eye, EyeOff } from 'lucide-react'

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
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
              <Code2 size={22} className="text-white" />
            </div>
            <span className="text-[20px] font-medium leading-[23px]">Snip Labs</span>
          </Link>
          <h2 className="mt-6 text-[28px] font-medium leading-[29.4px]">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-[14px] font-normal leading-[23.8px] text-gray-500 dark:text-zinc-400">
            {mode === 'signin'
              ? 'Sign in to access your snippets'
              : 'Start organizing your knowledge'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="mb-1 block text-[12px] font-semibold leading-[20.4px]">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-brand-500"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-[12px] font-semibold leading-[20.4px]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-brand-500"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-[12px] font-semibold leading-[20.4px]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-brand-500"
                placeholder="Min 8 characters"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
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

        {/* Toggle mode */}
        <p className="text-center text-[14px] leading-[23.8px] text-gray-500 dark:text-zinc-400">
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
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
