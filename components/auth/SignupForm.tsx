'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          wave_tier: 'genesis' // Default to genesis tier
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess('Account created! Check your email to confirm.')
      
    } catch (err: unknown) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-white">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 bg-slate-800 border-slate-600 text-white"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 bg-slate-800 border-slate-600 text-white"
            placeholder="Create a password"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-white">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 bg-slate-800 border-slate-600 text-white"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-400 text-sm text-center">
          {success}
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>

      <div className="text-center">
        <a href="/auth/login" className="text-purple-400 hover:text-purple-300 text-sm">
          Already have an account? Sign in
        </a>
      </div>
    </form>
  )
}