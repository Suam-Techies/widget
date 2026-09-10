'use client';
import React, { useState, useEffect } from 'react';
import { ChatIcon, CloseIcon, MinimizeIcon, BookIcon, FlaskIcon, CodeIcon, SoundOnIcon, SoundOffIcon, RefreshIcon, ShieldCheckIcon } from './Icons';
import ChatTab from './ChatTab';
import HelpTab from './HelpTab';
import DiagnosticsTab from './DiagnosticsTab';
import EmbedTab from './EmbedTab';
import { FIXONCE_SUGGESTED_CHIPS, FIXONCE_QA_FALLBACK_ANSWERS, FIXONCE_KB_ARTICLES } from '../data/qaKnowledgeBase';

export default function FixOnceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTeaser, setShowTeaser] = useState(false);

  const initialMessages = [{
    id: 'msg-welcome',
    sender: 'bot',
    timestamp: 'Just now',
    text: `👋 **Hi there! Welcome to FixOnce QA.**

I'm your QA & Bug Fix Verification assistant. Ask me anything about:
- **"Fix Once, Test Forever"** zero-regression workflows
- Synthesizing automated Playwright, Cypress, or Jest regression suites
- How FixOnce eliminates flaky tests in CI/CD pipelines
- Triage & verification for any bug fix

How can I help your QA process today?`,
    quickReplies: ['What is FixOnce QA?', 'How to verify a bug fix?', 'Generate regression test case', 'Supported CI/CD runners']
  }];
  const [messages, setMessages] = useState(initialMessages);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio might require user interaction first
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTeaser(true);
        setUnreadCount(1);
        playChime();
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleWidget = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        setShowTeaser(false);
        setUnreadCount(0);
      }
      return next;
    });
  };

  const handleResetChat = () => setMessages(initialMessages);

  const handleSendMessage = (userText) => {
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let matchedAnswer = null;
      for (const item of FIXONCE_QA_FALLBACK_ANSWERS) {
        if (item.triggers.some(trig => lower.includes(trig))) {
          matchedAnswer = item;
          break;
        }
      }
      if (!matchedAnswer) {
        const kbMatch = FIXONCE_KB_ARTICLES.find(article =>
          article.title.toLowerCase().includes(lower) ||
          article.tags.some(t => lower.includes(t)) ||
          article.content.toLowerCase().includes(lower)
        );
        if (kbMatch) {
          matchedAnswer = {
            response: `### ${kbMatch.title}\n\n${kbMatch.content}`,
            quickReplies: ['How to verify a bug fix?', 'Generate regression test case', 'Ask another question']
          };
        }
      }

      const responseText = matchedAnswer
        ? matchedAnswer.response
        : `Regarding **"${userText}"**:

FixOnce QA analyzes bug reports and code changes to guarantee zero regressions. Here are the recommended next steps:

1. **Test Synthesis**: Use our **Verify Fix tab (🧪)** to auto-generate negative proof tests for your stack.
2. **CI/CD Integration**: Connect **fixonce/qa-verify-action** so every resolved bug triggers automated pre-fix failure checks and post-fix passes.
3. **Flakiness Safeguards**: FixOnce performs 10x isolated burn-in runs before admitting tests into master.

Would you like to generate a sample test suite, or learn more about CI/CD setup?`;
      const quickReplies = matchedAnswer?.quickReplies || ['How does FixOnce verify fixes?', 'Supported CI/CD runners', 'Open QA Diagnostics wizard'];
      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        quickReplies
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      playChime();
    }, 600 + Math.random() * 300);
  };

  const handleSelectChip = chipText => handleSendMessage(chipText);
  const handleAskInChat = text => {
    setActiveTab('chat');
    handleSendMessage(text);
  };

  return (
    <div className="fo-widget-anchor">
      {!isOpen && showTeaser && (
        <div onClick={handleToggleWidget} className="fo-widget-teaser">
          <div className="fo-teaser-content">
            <div className="fo-teaser-avatar">FO<span className="fo-online-dot" style={{ top: 0, right: 0 }} /></div>
            <div className="fo-teaser-text" style={{ flex: 1 }}>
              <h5><span>FixOnce QA Assistant</span><button type="button" onClick={e => { e.stopPropagation(); setShowTeaser(false); }} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button></h5>
              <p>👋 Questions on bug verification or test automation? Chat with our QA engine!</p>
              <div className="fo-teaser-cta"><span>Start conversation</span> →</div>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fo-chat-window">
          <div className="fo-chat-header">
            <div className="fo-header-left">
              <div className="fo-avatar-wrap"><ShieldCheckIcon /><span className="fo-online-indicator" /></div>
              <div className="fo-header-titles">
                <h3>FixOnce QA <span className="fo-badge-pill" style={{ padding: '0.1rem 0.4rem', fontSize: '0.62rem' }}>AI Bot</span></h3>
                <p><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Replies instantly • "Fix Once, Test Forever"</p>
              </div>
            </div>
            <div className="fo-header-actions">
              <button type="button" onClick={() => setSoundEnabled(prev => !prev)} className="fo-icon-btn" title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}>{soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}</button>
              <button type="button" onClick={handleResetChat} className="fo-icon-btn" title="Restart chat"><RefreshIcon /></button>
              <button type="button" onClick={handleToggleWidget} className="fo-icon-btn" title="Minimize widget"><MinimizeIcon /></button>
            </div>
          </div>

          <div className="fo-tabs-body">
            {activeTab === 'chat' && <ChatTab messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} suggestedChips={FIXONCE_SUGGESTED_CHIPS} onSelectChip={handleSelectChip} onSwitchTab={setActiveTab} />}
            {activeTab === 'help' && <HelpTab onAskQuestionInChat={handleAskInChat} />}
            {activeTab === 'diagnostics' && <DiagnosticsTab onSendToChat={handleAskInChat} />}
            {activeTab === 'embed' && <EmbedTab />}
          </div>

          <div className="fo-tab-bar">
            <button type="button" onClick={() => setActiveTab('chat')} className={`fo-tab-nav-btn ${activeTab === 'chat' ? 'active' : ''}`}><ChatIcon /><span>Chat</span></button>
            <button type="button" onClick={() => setActiveTab('help')} className={`fo-tab-nav-btn ${activeTab === 'help' ? 'active' : ''}`}><BookIcon /><span>Help & QA</span></button>
            <button type="button" onClick={() => setActiveTab('diagnostics')} className={`fo-tab-nav-btn ${activeTab === 'diagnostics' ? 'active' : ''}`}><FlaskIcon /><span>Verify Fix</span></button>
            <button type="button" onClick={() => setActiveTab('embed')} className={`fo-tab-nav-btn ${activeTab === 'embed' ? 'active' : ''}`}><CodeIcon /><span>Embed</span></button>
          </div>
        </div>
      )}

      <button type="button" onClick={handleToggleWidget} aria-label="Toggle FixOnce QA Chat" className="fo-trigger-btn">
        <span className="fo-pulse-halo" />
        {isOpen ? <CloseIcon /> : <><ChatIcon /><span className="fo-online-dot" />{unreadCount > 0 && <span className="fo-unread-badge">{unreadCount}</span>}</>}
      </button>
    </div>
  );
}
