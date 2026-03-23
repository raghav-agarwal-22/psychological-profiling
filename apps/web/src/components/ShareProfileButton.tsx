'use client'

import { useState } from 'react'

interface ShareProfileButtonProps {
  archetype: string
}

export function ShareProfileButton({ archetype }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    const shareData = {
      title: `${archetype} — My Innermind Profile`,
      text: `I just discovered my psychological archetype: ${archetype}. What are you?`,
      url,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user cancelled or not supported — fall through to clipboard
        await copyToClipboard(url)
      }
    } else {
      await copyToClipboard(url)
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/60 px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-600 hover:text-stone-100"
    >
      <span>{copied ? '✓ Copied' : '↑ Share this profile'}</span>
    </button>
  )
}
