// app/components/ArticlePage.tsx
'use client'

import parse from 'html-react-parser'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ArticlePage({ selectedArticle, handleBackToList }: any) {
  if (!selectedArticle) return null

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-8 py-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToList}
          className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          {selectedArticle.title}
        </h1>

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

        {/* Parsed HTML content */}
        <article className="prose prose-invert max-w-none text-white">
          {parse(selectedArticle.content)}
        </article>
      </div>
    </main>
  )
}
