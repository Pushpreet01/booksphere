// components/Layout.js
import Link from 'next/link'
import AuthButton from './AuthButton'

export default function Layout({ children }) {
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground">
      {/* Header/Nav */}
      <header className="bg-transparent border-b border-primary-light/20">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-primary uppercase tracking-wider">
            BookSphere
          </Link>
          <div className="space-x-6">
            <Link href="/" className="text-foreground hover:text-primary-light transition-colors">
              Home
            </Link>
            <Link href="/community" className="text-foreground hover:text-primary-light transition-colors">
              Community
            </Link>
            <AuthButton />
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-grow container mx-auto px-6 py-8 bg-base-100 rounded-lg shadow-custom">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary-light/20 bg-transparent">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-foreground/70">
          © {year} BookSphere
        </div>
      </footer>
    </div>
  )
}