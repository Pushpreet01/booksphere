import { useState, useEffect } from 'react'
import Link from 'next/link'
import { onUserStateChange, signOut } from '../lib/firebase'

export default function AuthButton() {
  const [user, setUser] = useState(null)
  useEffect(() => onUserStateChange(setUser), [])

  return user ? (
    <button onClick={signOut} className="text-foreground hover:text-primary-light transition-colors">
      Logout
    </button>
  ) : (
    <Link href="/auth" className="btn bg-primary text-white border-none rounded-full px-4 py-2 hover:bg-primary-light">
      Login
    </Link>
  )
}