'use client';
import React, { useState, useEffect } from 'react';
import {
  ChatIcon,
  CloseIcon,
  MinimizeIcon,
  SoundOnIcon,
  SoundOffIcon,
  RefreshIcon,
  ShieldCheckIcon
} from './Icons';
import ChatTab from './ChatTab';

const TRAVEL_ASSISTANCE_REPLIES = [
  '📞 Yes, Call Me',
  '💬 Continue Chat'
];

const TRAVEL_MENU_REPLIES = [
  '✈️ Book a Flight',
  '🔄 Change or Cancel Booking',
  '📋 Check Reservation',
  '💰 Find Better Fare',
  '👨‍💼 Talk to a Travel Expert'
];

const COUNTRY_PHONE_NUMBERS = {
  aus: '+611800231285',
  australia: '+611800231285',
  usa: '+18664368404',
  'united states': '+18664368404',
  uk: '+448081757391',
  'united kingdom': '+448081757391',
  chile: '+56800914205',
  mexico: '+528004610026'
};

const COUNTRY_REPLIES = ['AUS', 'USA', 'UK', 'CHILE', 'MEXICO'];

export default function FixOnceChatWidget({ openOnMount = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTeaser, setShowTeaser] = useState(false);

  const initialMessages = [
    {
      id: 'msg-welcome',
      sender: 'bot',
      timestamp: 'Just now',
      text: `
    What do you need help with today?`,
      quickReplies: TRAVEL_MENU_REPLIES
    }
  ];

  const [messages, setMessages] = useState(initialMessages);

  // Subtle web audio chime
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
    const openFromHash = () => {
      if (openOnMount || window.location.hash === '#widget-preview') {
        setIsOpen(true);
        setShowTeaser(false);
        setUnreadCount(0);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTeaser(true);
        setUnreadCount(1);
        playChime();
      }
    }, 3500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', openFromHash);
    };
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

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

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
      const selectedCountry = Object.keys(COUNTRY_PHONE_NUMBERS).find(country =>
        lower.trim() === country
      );

      if (selectedCountry) {
        matchedAnswer = {
          response: `📞 **${selectedCountry.toUpperCase()} support number:** ${COUNTRY_PHONE_NUMBERS[selectedCountry]}`,
          quickReplies: COUNTRY_REPLIES
        };
      } else if (lower.includes('book a flight') || lower.includes('book flight')) {
        matchedAnswer = {
          response: `✈️ **Let's book your flight.**

Please share your departure city, destination, travel dates, and the number of passengers.

Would you like to connect with a representative?`,
          quickReplies: TRAVEL_ASSISTANCE_REPLIES
        };
      } else if (lower.includes('change') || lower.includes('cancel')) {
        matchedAnswer = {
          response: `🔄 **I can help with your booking change or cancellation.**

Please provide your reservation number and tell me what you would like to change.

Would you like to connect with a representative?`,
          quickReplies: TRAVEL_ASSISTANCE_REPLIES
        };
      } else if (lower.includes('check reservation') || lower.includes('reservation')) {
        matchedAnswer = {
          response: `📋 **Let's check your reservation.**

Please enter your confirmation number and the last name on the booking.

Would you like to connect with a representative?`,
          quickReplies: TRAVEL_ASSISTANCE_REPLIES
        };
      } else if (lower.includes('better fare') || lower.includes('better price')) {
        matchedAnswer = {
          response: `💰 **I'll help you find a better fare.**

Share your current itinerary or reservation number and I’ll look for available options.

Would you like to connect with a representative?`,
          quickReplies: TRAVEL_ASSISTANCE_REPLIES
        };
      } else if (lower.includes('yes, call me') || lower.includes('yes call me')) {
        matchedAnswer = {
          response: `📞 **Contact us on the numbers below:**

 - **AUS:** ${COUNTRY_PHONE_NUMBERS.aus}
 - **USA:** ${COUNTRY_PHONE_NUMBERS.usa}
 - **UK:** ${COUNTRY_PHONE_NUMBERS.uk}
 - **CHILE:** ${COUNTRY_PHONE_NUMBERS.chile}
 - **MEXICO:** ${COUNTRY_PHONE_NUMBERS.mexico}`,
          quickReplies: COUNTRY_REPLIES
        };
      } else if (lower.includes('travel expert')) {
        matchedAnswer = {
          response: `👨‍💼 **A travel expert can help you faster by phone.**

Please select your country to get the right support number.`,
          quickReplies: COUNTRY_REPLIES
        };
      } else if (lower.includes('continue chat')) {
        matchedAnswer = {
          response: `💬 **Of course. I’m happy to help here.**

What would you like to take care of today?`,
          quickReplies: TRAVEL_MENU_REPLIES
        };
      } else if (lower.includes('what do you need help') || lower === 'question 1') {
        matchedAnswer = {
          response: 'What do you need help with today?',
          quickReplies: TRAVEL_MENU_REPLIES
        };
      }

      const responseText = matchedAnswer?.response || `I can help with flights, bookings, reservations, and fares.

What would you like to take care of today?`;
      const quickReplies = matchedAnswer?.quickReplies || TRAVEL_MENU_REPLIES;

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

  return (
    <div id="widget-preview" className="fo-widget-anchor">
      {/* Proactive Teaser Box */}
      {!isOpen && showTeaser && (
        <div onClick={handleToggleWidget} className="fo-widget-teaser">
          <div className="fo-teaser-content">
            <div className="fo-teaser-avatar">
              FO
              <span className="fo-online-dot" style={{ top: 0, right: 0 }} />
            </div>
            <div className="fo-teaser-text" style={{ flex: 1 }}>
              <h5>
                <span>Travel Assistance</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTeaser(false);
                  }}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  ✕
                </button>
              </h5>
              <p>👋 Need help with a flight, booking, or reservation? Chat with a travel expert!</p>
              <div className="fo-teaser-cta">
                <span>Start conversation</span> →
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tawk.to Window */}
      {isOpen && (
        <div className="fo-chat-window">
          {/* Header */}
          <div className="fo-chat-header">
            <div className="fo-header-left">
              <div className="fo-avatar-wrap">
                <ShieldCheckIcon />
                <span className="fo-online-indicator" />
              </div>
              <div className="fo-header-titles">
                <h3>
                  Travel Assistance
                  <span className="fo-badge-pill" style={{ padding: '0.1rem 0.4rem', fontSize: '0.62rem' }}>
                    AI Bot
                  </span>
                </h3>
                <p>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Replies instantly • Travel support
                </p>
              </div>
            </div>

            <div className="fo-header-actions">
              <button
                type="button"
                onClick={() => setSoundEnabled(prev => !prev)}
                className="fo-icon-btn"
                title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
              </button>
              <button
                type="button"
                onClick={handleResetChat}
                className="fo-icon-btn"
                title="Restart chat"
              >
                <RefreshIcon />
              </button>
              <button
                type="button"
                onClick={handleToggleWidget}
                className="fo-icon-btn"
                title="Minimize widget"
              >
                <MinimizeIcon />
              </button>
            </div>
          </div>

          {/* Travel conversation */}
          <div className="fo-tabs-body">
            <ChatTab
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              suggestedChips={[]}
              onSelectChip={handleSelectChip}
            />
          </div>

          {/* Footer Tab Bar */}
    
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={handleToggleWidget}
        aria-label="Toggle travel assistance chat"
        className="fo-trigger-btn"
      >
        <span className="fo-pulse-halo" />
        {isOpen ? (
          <CloseIcon />
        ) : (
          <>
            <ChatIcon />
            <span className="fo-online-dot" />
            {unreadCount > 0 && (
              <span className="fo-unread-badge">{unreadCount}</span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
