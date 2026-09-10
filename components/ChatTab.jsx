'use client';
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, SparklesIcon, ThumbsUpIcon, ThumbsDownIcon, CopyIcon, CheckIcon } from './Icons';

export default function ChatTab({ messages, onSendMessage, isTyping, suggestedChips, onSelectChip, onSwitchTab }) {
  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (msgId, type) => {
    setFeedback(prev => ({ ...prev, [msgId]: type }));
  };

  const renderContent = (content, msgId) => {
    if (content.includes('```')) {
      const parts = content.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          const lines = part.split('\n');
          const lang = lines[0].trim();
          const codeBody = (lang && !lang.includes(' ')) ? lines.slice(1).join('\n') : part;
          const blockId = `${msgId}-code-${index}`;

          return (
            <div key={index} className="fo-code-block">
              <div className="fo-code-header">
                <span>{lang || 'CODE'}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(codeBody.trim(), blockId)}
                  className="fo-code-copy-btn"
                >
                  {copiedId === blockId ? (
                    <>
                      <CheckIcon />
                      <span style={{ color: '#10b981' }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="fo-code-body">
                <code>{codeBody.trim()}</code>
              </pre>
            </div>
          );
        }
        return renderInline(part, index);
      });
    }

    return renderInline(content, 'single');
  };

  const renderInline = (text, key) => {
    const lines = text.split('\n');
    return (
      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {lines.map((line, lIdx) => {
          if (!line.trim()) return <div key={lIdx} style={{ height: '0.25rem' }} />;
          
          let parsed = line;
          const isBullet = parsed.trim().startsWith('- ') || parsed.trim().startsWith('• ');
          if (isBullet) {
            parsed = parsed.trim().replace(/^[-•]\s+/, '');
          }

          const segments = parsed.split(/(\*{2}[^*]+\*{2}|`[^`]+`|\+\d[\d\s-]{6,}\d)/g);

          return (
            <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              {isBullet && <span style={{ color: '#10b981', fontWeight: 'bold' }}>•</span>}
              <div style={{ flex: 1 }}>
                {segments.map((seg, sIdx) => {
                  if (seg.startsWith('**') && seg.endsWith('**')) {
                    return <strong key={sIdx} style={{ color: '#17231b', fontWeight: 700 }}>{seg.slice(2, -2)}</strong>;
                  }
                  if (seg.startsWith('`') && seg.endsWith('`')) {
                    return (
                      <code
                        key={sIdx}
                        style={{
                          background: '#e5efe7',
                          color: '#166534',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.74rem'
                        }}
                      >
                        {seg.slice(1, -1)}
                      </code>
                    );
                  }
                  if (/^\+\d[\d\s-]{6,}\d$/.test(seg)) {
                    const phoneNumber = seg.replace(/[^\d+]/g, '');
                    return (
                      <a
                        key={sIdx}
                        href={`tel:${phoneNumber}`}
                        style={{ color: '#15803d', textDecoration: 'underline', fontWeight: 600 }}
                      >
                        {seg}
                      </a>
                    );
                  }
                  return seg;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fo-chat-view">
      {/* Messages Scroll Area */}
      <div className="fo-messages-stream fo-custom-scroll">
        {messages.map((msg) => (
          <div key={msg.id} className={`fo-msg-row ${msg.sender}`}>
            <div className="fo-msg-meta">
              {msg.sender === 'bot' && (
                <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <SparklesIcon /> Travel Assistant
                </span>
              )}
              {msg.sender === 'user' && <span>You</span>}
              <span>•</span>
              <span>{msg.timestamp || 'Just now'}</span>
            </div>

            <div className="fo-msg-bubble">
              {renderContent(msg.text, msg.id)}
            </div>

            {/* Quick replies */}
            {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="fo-chips-wrap">
                {msg.quickReplies.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (chip.includes('Diagnostics')) {
                        onSwitchTab?.('diagnostics');
                      } else {
                        onSelectChip(chip);
                      }
                    }}
                    className="fo-reply-chip"
                  >
                    ⚡ {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Helpful feedback buttons */}
            {msg.sender === 'bot' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', padding: '0 0.25rem', fontSize: '0.68rem', color: '#6b7280' }}>
                <span>Helpful?</span>
                <button
                  type="button"
                  onClick={() => handleFeedback(msg.id, 'up')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: feedback[msg.id] === 'up' ? '#10b981' : '#6b7280' }}
                >
                  <ThumbsUpIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleFeedback(msg.id, 'down')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: feedback[msg.id] === 'down' ? '#f43f5e' : '#6b7280' }}
                >
                  <ThumbsDownIcon />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="fo-typing-pill">
            <SparklesIcon style={{ color: '#10b981' }} />
            <div className="fo-dots-wrap">
              <span className="fo-dot" />
              <span className="fo-dot" />
              <span className="fo-dot" />
            </div>
            <span>Travel Assistant analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts strip */}
      {suggestedChips && suggestedChips.length > 0 && messages.length <= 4 && (
        <div className="fo-prompt-strip fo-custom-scroll">
          {suggestedChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectChip(chip)}
              className="fo-prompt-item"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="fo-chat-input-bar">
        <div className="fo-input-field-wrap">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder=""
            className="fo-chat-input"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="fo-send-btn"
            title="Send message"
          >
            <SendIcon />
          </button>
        </div>

      </form>
    </div>
  );
}
