'use client';
import React, { useState, useMemo } from 'react';
import { SearchIcon, BookIcon, CheckIcon, CopyIcon, SparklesIcon } from './Icons';
import { FIXONCE_KB_ARTICLES, FIXONCE_CATEGORIES } from '../data/qaKnowledgeBase';

export default function HelpTab({ onAskQuestionInChat }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredArticles = useMemo(() => {
    return FIXONCE_KB_ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      if (!searchQuery.trim()) return matchesCategory;

      const q = searchQuery.toLowerCase();
      const inTitle = article.title.toLowerCase().includes(q);
      const inSummary = article.summary.toLowerCase().includes(q);
      const inContent = article.content.toLowerCase().includes(q);
      const inTags = article.tags.some(t => t.toLowerCase().includes(q));

      return matchesCategory && (inTitle || inSummary || inContent || inTags);
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fo-help-view fo-custom-scroll">
      {/* Search Box */}
      <div className="fo-search-box">
        <SearchIcon style={{ color: '#9ca3af', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search QA knowledge, CI/CD, tests..."
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="fo-cat-chips fo-custom-scroll">
        {FIXONCE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`fo-cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#9ca3af' }}>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>No articles matched "{searchQuery}"</p>
            <button
              type="button"
              onClick={() => onAskQuestionInChat?.(searchQuery)}
              className="fo-action-btn"
              style={{ padding: '0.45rem 0.85rem', margin: '0 auto', fontSize: '0.72rem' }}
            >
              <SparklesIcon /> Ask AI QA Bot Directly
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isExpanded = expandedArticleId === article.id;
            return (
              <div key={article.id} className="fo-article-card">
                <div
                  className="fo-article-header"
                  onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        marginBottom: '0.3rem'
                      }}
                    >
                      {article.category}
                    </span>
                    <h4 className="fo-article-title">{article.title}</h4>
                    <p className="fo-article-summary">{article.summary}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="fo-article-body">
                    <div>{article.content}</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.7rem' }}>
                      <button
                        type="button"
                        onClick={() => handleCopy(article.content, article.id)}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        {copiedId === article.id ? (
                          <>
                            <CheckIcon /> <span style={{ color: '#10b981' }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon /> <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onAskQuestionInChat?.(`Tell me more about: ${article.title}`)}
                        style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Discuss in Chat →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
