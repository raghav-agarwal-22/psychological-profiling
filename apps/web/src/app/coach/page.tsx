'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface Conversation {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
  messages?: Message[]
}

interface ConversationListItem {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
  messages: Array<{ content: string; role: string }>
}

// ─── Suggested starter prompts ────────────────────────────────────────────────

const STARTERS = [
  "Why do I keep repeating the same patterns in relationships?",
  "Help me understand my shadow — what am I not seeing about myself?",
  "What should I focus on growing in the next 3 months?",
  "I'm at a crossroads in my career. What does my profile say?",
  "Why do I struggle with [anxiety/intimacy/commitment]?",
]

// ─── Streaming fetch helper ───────────────────────────────────────────────────

async function streamMessage(
  conversationId: string,
  message: string,
  token: string,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/coach/conversations/${conversationId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }

  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value, { stream: true }))
  }
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isStreaming,
}: {
  message: Message
  isStreaming?: boolean
}) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mr-3 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-xs text-amber-400">
          ◈
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-amber-500/15 text-stone-100 ring-1 ring-amber-500/20'
            : 'rounded-tl-sm bg-stone-800/60 text-stone-200 ring-1 ring-stone-700/50'
        }`}
      >
        {message.content ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : isStreaming ? (
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:300ms]" />
          </span>
        ) : null}
      </div>
      {isUser && (
        <div className="ml-3 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-700 text-xs text-stone-400">
          You
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  creating,
}: {
  conversations: ConversationListItem[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  creating: boolean
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-stone-800 bg-stone-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 px-4 py-4">
        <Link href="/dashboard" className="text-xs text-stone-600 transition-colors hover:text-stone-400">
          ← Dashboard
        </Link>
        <span className="font-serif text-sm text-stone-400">Coach</span>
      </div>

      {/* New conversation button */}
      <div className="border-b border-stone-800 p-3">
        <button
          onClick={onNew}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm font-medium text-stone-200 transition-colors hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-stone-500 border-t-amber-400" />
          ) : (
            <span className="text-base leading-none">+</span>
          )}
          New conversation
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-stone-600">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full px-4 py-3 text-left transition-colors hover:bg-stone-900 ${
                activeId === conv.id ? 'bg-stone-900' : ''
              }`}
            >
              <p
                className={`truncate text-sm font-medium ${
                  activeId === conv.id ? 'text-amber-300' : 'text-stone-300'
                }`}
              >
                {conv.title ?? 'New conversation'}
              </p>
              <p className="mt-0.5 truncate text-xs text-stone-600">
                {new Date(conv.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </button>
          ))
        )}
      </div>

      <div className="border-t border-stone-800 p-4">
        <p className="text-center text-xs text-stone-700">Powered by your profile</p>
      </div>
    </aside>
  )
}

// ─── Empty conversation state ─────────────────────────────────────────────────

function EmptyConversation({ onStarter }: { onStarter: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5">
        <span className="text-3xl">◈</span>
      </div>
      <h2 className="mb-2 font-serif text-xl text-stone-100">Your AI Coach</h2>
      <p className="mb-8 max-w-sm text-center text-sm text-stone-500">
        Psychologically grounded coaching built around your profile. Ask anything — career,
        relationships, self-understanding.
      </p>
      <div className="grid w-full max-w-lg gap-2">
        {STARTERS.map((starter) => (
          <button
            key={starter}
            onClick={() => onStarter(starter)}
            className="rounded-xl border border-stone-800 bg-stone-900/50 px-4 py-3 text-left text-sm text-stone-400 transition-colors hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-300"
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── No conversation selected ─────────────────────────────────────────────────

function NoConversationSelected({ onNew, creating }: { onNew: () => void; creating: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/50">
        <span className="text-3xl text-stone-600">◈</span>
      </div>
      <h2 className="mb-2 font-serif text-xl text-stone-300">Select a conversation</h2>
      <p className="mb-6 text-sm text-stone-600">Or start a new one</p>
      <button
        onClick={onNew}
        disabled={creating}
        className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
      >
        {creating ? 'Creating…' : 'New conversation'}
      </button>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CoachPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [creatingConversation, setCreatingConversation] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requiresUpgrade, setRequiresUpgrade] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, scrollToBottom])

  // Load conversations on mount
  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    api
      .get<{ conversations: ConversationListItem[] }>('/api/coach/conversations', token)
      .then((data) => setConversations(data.conversations))
      .catch((err) => {
        const msg = err instanceof Error ? err.message : ''
        if (msg.includes('403') || msg.toLowerCase().includes('pro subscription')) {
          setRequiresUpgrade(true)
        } else {
          router.push('/auth/login')
        }
      })
      .finally(() => setLoadingConversations(false))
  }, [router])

  const handleSelectConversation = useCallback(async (id: string) => {
    const token = getToken()
    if (!token) return

    setLoadingMessages(true)
    setError(null)
    setSidebarOpen(false)

    try {
      const data = await api.get<{ conversation: Conversation & { messages: Message[] } }>(
        `/api/coach/conversations/${id}/messages`,
        token,
      )
      setActiveConversation(data.conversation)
      setMessages(data.conversation.messages ?? [])
    } catch {
      setError('Failed to load conversation.')
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  const handleNewConversation = useCallback(async () => {
    const token = getToken()
    if (!token) return

    setCreatingConversation(true)
    setError(null)

    try {
      const data = await api.post<{ conversation: Conversation }>(
        '/api/coach/conversations',
        {},
        token,
      )
      const conv = data.conversation
      setActiveConversation(conv)
      setMessages([])
      setConversations((prev) => [
        {
          id: conv.id,
          title: conv.title,
          createdAt: conv.createdAt,
          updatedAt: conv.createdAt,
          messages: [],
        },
        ...prev,
      ])
      setSidebarOpen(false)
      inputRef.current?.focus()
    } catch {
      setError('Failed to create conversation.')
    } finally {
      setCreatingConversation(false)
    }
  }, [])

  const handleSend = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim()
      if (!content || sending || !activeConversation) return

      const token = getToken()
      if (!token) return

      setInput('')
      setError(null)
      setSending(true)

      // Optimistically add user message
      const userMsg: Message = {
        id: `tmp-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setStreamingContent('')

      try {
        let accumulated = ''
        await streamMessage(activeConversation.id, content, token, (chunk) => {
          accumulated += chunk
          setStreamingContent(accumulated)
        })

        const assistantMsg: Message = {
          id: `tmp-assistant-${Date.now()}`,
          role: 'assistant',
          content: accumulated,
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMsg])
        setStreamingContent(null)

        // Refresh to get auto-generated title
        const updatedConv = await api
          .get<{ conversation: Conversation & { messages: Message[] } }>(
            `/api/coach/conversations/${activeConversation.id}/messages`,
            token,
          )
          .catch(() => null)

        if (updatedConv) {
          setActiveConversation(updatedConv.conversation)
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversation.id
                ? {
                    ...c,
                    title: updatedConv.conversation.title,
                    updatedAt: updatedConv.conversation.updatedAt,
                  }
                : c,
            ),
          )
        }
      } catch (err) {
        setStreamingContent(null)
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
        setInput(content)
        setError(err instanceof Error ? err.message : 'Failed to send message.')
      } finally {
        setSending(false)
        inputRef.current?.focus()
      }
    },
    [input, sending, activeConversation],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleStarterClick = useCallback(
    async (text: string) => {
      const token = getToken()
      if (!token) return

      let targetConvId = activeConversation?.id ?? null

      if (!targetConvId) {
        setCreatingConversation(true)
        try {
          const data = await api.post<{ conversation: Conversation }>(
            '/api/coach/conversations',
            {},
            token,
          )
          const conv = data.conversation
          targetConvId = conv.id
          setActiveConversation(conv)
          setMessages([])
          setConversations((prev) => [
            {
              id: conv.id,
              title: conv.title,
              createdAt: conv.createdAt,
              updatedAt: conv.createdAt,
              messages: [],
            },
            ...prev,
          ])
        } catch {
          setError('Failed to create conversation.')
          return
        } finally {
          setCreatingConversation(false)
        }
      }

      if (!targetConvId) return

      setError(null)
      setSending(true)

      const userMsg: Message = {
        id: `tmp-${Date.now()}`,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setStreamingContent('')

      try {
        let accumulated = ''
        await streamMessage(targetConvId, text, token, (chunk) => {
          accumulated += chunk
          setStreamingContent(accumulated)
        })

        const assistantMsg: Message = {
          id: `tmp-assistant-${Date.now()}`,
          role: 'assistant',
          content: accumulated,
          createdAt: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMsg])
        setStreamingContent(null)

        // Refresh to get the auto-generated title
        const updatedConv = await api
          .get<{ conversation: Conversation & { messages: Message[] } }>(
            `/api/coach/conversations/${targetConvId}/messages`,
            token,
          )
          .catch(() => null)

        if (updatedConv) {
          setActiveConversation(updatedConv.conversation)
          setConversations((prev) =>
            prev.map((c) =>
              c.id === targetConvId
                ? {
                    ...c,
                    title: updatedConv.conversation.title,
                    updatedAt: updatedConv.conversation.updatedAt,
                  }
                : c,
            ),
          )
        }
      } catch (err) {
        setStreamingContent(null)
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
        setError(err instanceof Error ? err.message : 'Failed to send message.')
      } finally {
        setSending(false)
        inputRef.current?.focus()
      }
    },
    [activeConversation],
  )

  // ─── Streaming message placeholder ────────────────────────────────────────

  const streamingMsg: Message | null =
    streamingContent !== null
      ? {
          id: 'streaming',
          role: 'assistant',
          content: streamingContent,
          createdAt: new Date().toISOString(),
        }
      : null

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loadingConversations) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  if (requiresUpgrade) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <span className="text-3xl text-amber-400">◎</span>
        </div>
        <h1 className="mb-3 font-serif text-3xl text-stone-100">AI Coach is a Pro feature</h1>
        <p className="mb-8 text-sm text-stone-400 leading-relaxed">
          Your AI coach gives you personalised guidance grounded in your full psychological profile.
          Upgrade to Pro to unlock unlimited coaching conversations.
        </p>
        <Link
          href="/upgrade"
          className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Upgrade to Pro →
        </Link>
        <Link href="/dashboard" className="mt-4 text-xs text-stone-500 hover:text-stone-400">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-stone-950/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, shown on lg+ */}
      <div
        className={`fixed inset-y-0 left-0 z-30 mt-16 transform transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:mt-0 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          conversations={conversations}
          activeId={activeConversation?.id ?? null}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          creating={creatingConversation}
        />
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-stone-800 bg-stone-950 px-4 py-3">
          {/* Mobile hamburger */}
          <button
            className="rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-stone-800 hover:text-stone-300 lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle conversation list"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-base text-stone-200">
              {activeConversation?.title ?? (activeConversation ? 'New conversation' : 'AI Coach')}
            </h1>
          </div>

          {/* New conversation button — desktop only */}
          {activeConversation && (
            <button
              onClick={handleNewConversation}
              disabled={creatingConversation}
              className="hidden rounded-xl border border-stone-700 px-3 py-1.5 text-xs text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200 disabled:opacity-50 lg:flex"
            >
              + New
            </button>
          )}
        </div>

        {/* Error bar */}
        {error && (
          <div className="flex items-center justify-between gap-4 border-b border-rose-800/30 bg-rose-950/20 px-5 py-3">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-400"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Messages / empty state */}
        <div className="flex-1 overflow-y-auto">
          {loadingMessages ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
            </div>
          ) : !activeConversation ? (
            <NoConversationSelected onNew={handleNewConversation} creating={creatingConversation} />
          ) : messages.length === 0 && streamingMsg === null ? (
            <EmptyConversation onStarter={handleStarterClick} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {streamingMsg && (
                <MessageBubble
                  key="streaming"
                  message={streamingMsg}
                  isStreaming={streamingContent === ''}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        {activeConversation && (
          <div className="border-t border-stone-800 bg-stone-950 px-4 py-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-end gap-3 rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 ring-0 transition-shadow focus-within:border-amber-500/40 focus-within:ring-1 focus-within:ring-amber-500/20">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    // Auto-resize
                    e.target.style.height = 'auto'
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your coach anything…"
                  rows={1}
                  disabled={sending}
                  className="flex-1 resize-none bg-transparent text-sm text-stone-100 placeholder-stone-600 outline-none disabled:opacity-50"
                  style={{ minHeight: '1.5rem', maxHeight: '10rem' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border border-stone-700 border-t-stone-950" />
                  ) : (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-stone-700">
                Press Enter to send &middot; Shift+Enter for new line
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
