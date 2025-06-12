'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to dashboard or protected area
      window.location.href = '/dashboard'
      
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 bg-slate-800 border-slate-600 text-white"
            placeholder="Enter your password"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>

      <div className="text-center">
        <a href="/auth/signup" className="text-purple-400 hover:text-purple-300 text-sm">
          Don't have an account? Sign up
        </a>
      </div>
    </form>
  )
}