'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface OwnerAuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

const authModeCopy = {
  'sign-in': {
    endpoint: '/api/auth/login',
    heading: 'Sign in to your menu',
    description: 'Return to the workspace for your restaurant menu.',
    autocomplete: 'current-password',
    submit: 'Sign in',
    minimumPasswordLength: undefined,
    passwordHint: undefined,
    alternatePrompt: 'New to MenuCraft?',
    alternateHref: '/sign-up',
    alternateLabel: 'Create an account',
  },
  'sign-up': {
    endpoint: '/api/auth/register',
    heading: 'Create your owner account',
    description: 'Create one workspace for the menu you maintain.',
    autocomplete: 'new-password',
    submit: 'Create account',
    minimumPasswordLength: 10,
    passwordHint: 'Use at least 10 characters. You can sign in again if your session expires.',
    alternatePrompt: 'Already have an account?',
    alternateHref: '/sign-in',
    alternateLabel: 'Sign in',
  },
} as const;

export function OwnerAuthForm({ mode }: OwnerAuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = authModeCopy[mode];

  /** Submit credentials, then return to the requested same-origin page or the workspace. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(copy.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error || 'Unable to continue. Try again.');
        return;
      }

      const requestedPath = new URLSearchParams(window.location.search).get('next');
      let destination = '/';
      if (requestedPath) {
        const requestedUrl = new URL(requestedPath, window.location.origin);
        if (requestedUrl.origin === window.location.origin) {
          destination = `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`;
        }
      }
      router.replace(destination);
      router.refresh();
    } catch {
      setError('Unable to connect. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-menu-cream-200 px-6 py-16 flex items-center justify-center">
      <section className="w-full max-w-md bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
        <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-5 text-center">
          <Link href="/" className="text-xl font-serif menu-title text-menu-charcoal-900">
            MenuCraft
          </Link>
          <h1 className="mt-5 text-2xl font-serif text-menu-charcoal-900">
            {copy.heading}
          </h1>
          <p className="mt-2 text-sm menu-description">
            {copy.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete={copy.autocomplete}
            required
            minLength={copy.minimumPasswordLength}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {copy.passwordHint && (
            <p className="text-xs text-menu-charcoal-500">
              {copy.passwordHint}
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-700" aria-live="polite">
              {error}
            </p>
          )}

          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : copy.submit}
          </Button>

          <p className="text-center text-sm text-menu-charcoal-600">
            {copy.alternatePrompt}{' '}
            <Link
              href={copy.alternateHref}
              className="font-semibold text-menu-gold-700 underline underline-offset-2"
            >
              {copy.alternateLabel}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
