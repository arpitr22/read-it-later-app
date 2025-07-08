'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import parse from 'html-react-parser'
import { ArrowLeft, ExternalLink, BookOpen, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Article = {
  id: string
  url: string
  title: string
  created_at: string
  content: string
  is_read?: boolean
}

function groupArticlesByDate(articles: Article[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const groups: { [key: string]: Article[] } = {
    Today: [],
    Yesterday: [],
    'Earlier this Week': [],
    Earlier: [],
  }

  articles.forEach((article) => {
    const articleDate = new Date(article.created_at)
    const articleDay = new Date(articleDate.getFullYear(), articleDate.getMonth(), articleDate.getDate())

    if (articleDay.getTime() === today.getTime()) {
      groups['Today'].push(article)
    } else if (articleDay.getTime() === yesterday.getTime()) {
      groups['Yesterday'].push(article)
    } else if (articleDay > weekAgo) {
      groups['Earlier this Week'].push(article)
    } else {
      groups['Earlier'].push(article)
    }
  })

  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key]
    }
  })

  return groups
}

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'reader'>('list')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setArticles(data || [])
      }
      setLoading(false)
    }

    fetchArticles()
  }, [])

  const groupedArticles = groupArticlesByDate(articles)

  if (view === 'reader' && selectedArticle) {
    return (
      <main className="min-h-screen bg-black text-white px-4 md:px-12 py-6 font-sans">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedArticle(null)
              setView('list')
            }}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{selectedArticle.title}</h1>

          {/* Date */}
          <p className="text-gray-400 text-sm mb-6">
            {new Date(selectedArticle.created_at).toLocaleDateString()}
          </p>

          {/* Open Original Link */}
          <div className="flex justify-end mb-6">
            <Button asChild className="gap-2">
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="w-4 h-4" />
                Open Article
              </a>
            </Button>
          </div>

          {/* Parsed HTML */}
          <article className="prose prose-invert max-w-none text-white">
            {parse(selectedArticle.content)}
          </article>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 py-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Read It Later
          </h1>
          <p className="text-gray-400">Your saved articles, organized by time</p>
        </div>

        {loading ? (
          <p className="text-gray-400">Fetching articles...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          Object.entries(groupedArticles).map(([groupName, group]) => (
            <div key={groupName} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {groupName}
              </h2>
              <div className="space-y-3">
                {group.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedArticle(article)
                      setView('reader')
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-white line-clamp-2 leading-snug">{article.title}</h3>
                            {!article.is_read && (
                              <Badge variant="secondary" className="bg-blue-900 text-blue-200 text-xs shrink-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>{new Date(article.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
