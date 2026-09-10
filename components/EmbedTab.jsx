'use client';
import React, { useState } from 'react';
import { CodeIcon, CheckIcon, CopyIcon } from './Icons';

export default function EmbedTab() {
  const [embedType, setEmbedType] = useState('html');
  const [copied, setCopied] = useState(false);

  const htmlCode = `<!-- FixOnce QA Tawk.to Style Chatbot Widget -->
<script type="text/javascript">
  window.FixOnceChatConfig = {
    apiKey: "fixonce_live_qa_98234",
    position: "bottom-right",
    theme: "dark",
    primaryColor: "#059669",
    autoGreeting: true
  };
</script>
<script async src="https://cdn.fixonceqa.com/widget/v2/fixonce-widget.js"></script>`;

  const reactCode = `// In your Next.js / React App:
import FixOnceChatWidget from '@/components/FixOnceChatWidget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Floating Tawk.to-style FixOnce QA Widget */}
        <FixOnceChatWidget />
      </body>
    </html>
  );
}`;

  const currentCode = embedType === 'html' ? htmlCode : reactCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fo-embed-view fo-custom-scroll">
      <div className="fo-diag-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600, fontSize: '0.78rem' }}>
          <CodeIcon /> Embed Widget on Your Website
        </div>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.25rem' }}>
          Integrate the FixOnce QA floating chatbot widget into any web app with a single code snippet.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
        <button
          type="button"
          onClick={() => setEmbedType('html')}
          style={{
            padding: '0.4rem',
            borderRadius: '6px',
            border: embedType === 'html' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
            background: embedType === 'html' ? '#10b981' : '#141724',
            color: embedType === 'html' ? '#090a10' : '#9ca3af',
            fontWeight: 600,
            fontSize: '0.72rem',
            cursor: 'pointer'
          }}
        >
          HTML / Script Tag
        </button>
        <button
          type="button"
          onClick={() => setEmbedType('react')}
          style={{
            padding: '0.4rem',
            borderRadius: '6px',
            border: embedType === 'react' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
            background: embedType === 'react' ? '#10b981' : '#141724',
            color: embedType === 'react' ? '#090a10' : '#9ca3af',
            fontWeight: 600,
            fontSize: '0.72rem',
            cursor: 'pointer'
          }}
        >
          React / Next.js
        </button>
      </div>

      <div className="fo-code-block">
        <div className="fo-code-header">
          <span>{embedType === 'html' ? 'index.html' : 'layout.jsx'}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="fo-code-copy-btn"
          >
            {copied ? (
              <>
                <CheckIcon /> <span style={{ color: '#10b981' }}>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon /> <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="fo-code-body">
          <code>{currentCode}</code>
        </pre>
      </div>

      <div style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <strong style={{ color: '#fff' }}>Configuration Parameters:</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div><code style={{ color: '#6ee7b7' }}>position</code>: 'bottom-right' | 'bottom-left'</div>
          <div><code style={{ color: '#6ee7b7' }}>theme</code>: 'dark' | 'light'</div>
          <div><code style={{ color: '#6ee7b7' }}>autoGreeting</code>: true (displays teaser after 3.5s)</div>
          <div><code style={{ color: '#6ee7b7' }}>onFixVerified</code>: callback hook when fix triage completes</div>
        </div>
      </div>
    </div>
  );
}
