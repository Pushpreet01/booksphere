import { useState } from 'react';
import { useRouter } from 'next/router';
import { signUp, signIn, createProfile } from '../lib/firebase';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const cred = await signUp(email, password);
        await createProfile(username, cred.user.uid);
      } else {
        await signIn(email, password);
      }
      router.push('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-base-100 shadow-custom rounded-lg">
      <h2 className="text-3xl font-bold text-primary uppercase tracking-wider mb-6">
        {isSignUp ? 'Sign Up' : 'Log In'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            className="input h-12 w-full p-4 rounded-4xl shadow-custom border border-black focus:outline-none focus:ring-2 focus:ring-primary-light"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="input h-12 w-full p-4 rounded-4xl shadow-custom border border-black focus:outline-none focus:ring-2 focus:ring-primary-light"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input h-12 w-full p-4 rounded-4xl shadow-custom border border-black focus:outline-none focus:ring-2 focus:ring-primary-light"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn bg-primary text-white border-none rounded-full px-4 py-2 w-full hover:bg-primary-light">
          {isSignUp ? 'Create Account' : 'Log In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:text-primary-light transition-colors underline"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}