import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Join Arkana
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Create your account and join the waitlist
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}